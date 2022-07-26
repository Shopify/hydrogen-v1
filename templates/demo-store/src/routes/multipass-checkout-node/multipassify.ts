export interface InputType {
  email: string;
  created_at?: string;
  [key: string]: any;
}

export interface GenerateUrlType {
  obj: object;
  domain: string;
}

export class Multipassify {
  private crypto: any | null; // TODO: the Crypto type is the v8 version which has a different interface.
  private readonly BLOCK_SIZE: number;
  private encryptionKey: ArrayBuffer | null;
  private signingKey: ArrayBuffer | null;

  constructor(
    crypto?: any,
    encryptionKey?: ArrayBuffer,
    signingKey?: ArrayBuffer,
  ) {
    this.crypto = crypto || null;
    this.BLOCK_SIZE = 16;
    this.encryptionKey = encryptionKey || null;
    this.signingKey = signingKey || null;
    return this;
  }

  public async init(secret: string): Promise<Multipassify> {
    if (!(typeof secret == 'string' && secret.length > 0)) {
      throw new Error('Invalid Secret');
    }
    const crypto = await import('node:crypto');

    // @ts-ignore - ts is confused that this is the native v8 crypto method :()
    const hash = await crypto.subtle.digest('SHA-256', secret);
    const encryptionKey = hash.slice(0, this.BLOCK_SIZE);
    const signingKey = hash.slice(this.BLOCK_SIZE, 32);
    return new Multipassify(crypto, encryptionKey, signingKey);
  }

  public async generateUrl(obj: InputType, domain: string) {
    if (!domain) return;

    const token = await this.encode(obj);

    return `https://${domain}/account/login/multipass/${token}`;
  }

  public async encode(obj: InputType) {
    if (!obj) return;

    // Store the current time in ISO8601 format.
    // The token will only be valid for a small timeframe around this timestamp.
    obj['created_at'] = new Date().toISOString();

    // Serialize the customer data to JSON and encrypt it
    const cipherText = await this.encrypt(JSON.stringify(obj));

    const signature = await this.sign(cipherText);

    // Create a signature (message authentication code) of the ciphertext
    // and encode everything using URL-safe Base64 (RFC 4648)
    let token = Buffer.concat([cipherText, signature]).toString('base64');

    token = token
      .replace(/\+/g, '-') // Replace + with -
      .replace(/\//g, '_'); // Replace / with _

    return token;
  }

  private async encrypt(plaintext: string) {
    // Use a random IV
    const iv = this.crypto.randomBytes(this.BLOCK_SIZE);

    const cipher = this.crypto.createCipheriv(
      'aes-128-cbc',
      this.encryptionKey,
      iv,
    );

    // Use IV as first block of ciphertext
    const encrypted = Buffer.concat([
      iv,
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);

    return encrypted;
  }

  private async sign(cipherText: Buffer) {
    return this.crypto
      .createHmac('SHA256', this.signingKey)
      .update(cipherText)
      .digest();
  }
}
