import * as CryptoJS from 'crypto-js';
import type {MultipassCustomer} from '../types';

/*
  Shopify multipassify implementation for node and v8/worker runtime
  based on crypto-js.
  ------------------------------------------------------------
  @see: https://shopify.dev/api/multipass — Shopify multipass
  @see: https://github.com/beaucoo/multipassify — Previous art for Node-only runtime
*/
export class Multipassify {
  private readonly BLOCK_SIZE: number;
  private encryptionKey: CryptoJS.lib.WordArray;
  private signingKey: CryptoJS.lib.WordArray;

  constructor(secret: string) {
    if (!(typeof secret == 'string' && secret.length > 0)) {
      throw new Error('Invalid Secret');
    }

    this.BLOCK_SIZE = 16;

    // Hash the secret
    const digest = CryptoJS.SHA256(secret);

    // create the encryption and signing keys
    this.encryptionKey = CryptoJS.lib.WordArray.create(
      digest.words.slice(0, this.BLOCK_SIZE / 4)
    );
    this.signingKey = CryptoJS.lib.WordArray.create(
      digest.words.slice(this.BLOCK_SIZE / 4, this.BLOCK_SIZE / 2)
    );

    return this;
  }

  // Generates an auth `token` and `url` for a customer based
  // on the `return_to` url property found in the customer object
  public generate(customer: MultipassCustomer, shopifyDomain: string) {
    if (!shopifyDomain) {
      throw new Error('domain is required');
    }
    if (!customer?.email) {
      throw new Error('customer email is required');
    }

    const token = this.generateToken(customer);

    return {
      url: `https://${shopifyDomain}/account/login/multipass/${token}`,
      token,
    };
  }

  // Generates a token
  public generateToken(customer: MultipassCustomer): string {
    // Store the current time in ISO8601 format.
    // The token will only be valid for a small time-frame around this timestamp.
    customer.created_at = new Date().toISOString();

    const encrypted = this.encrypt(JSON.stringify(customer));
    const signature = this.sign(encrypted);

    // @ts-ignore - concat is a method on WordArray
    const token = encrypted.concat(signature);
    let token64 = token.toString(CryptoJS.enc.Base64);

    token64 = token64
      .replace(/\+/g, '-') // Replace + with -
      .replace(/\//g, '_'); // Replace / with _

    return token64;
  }

  // encrypt the customer data
  private encrypt(customerText: string) {
    // Use a random IV
    const iv = CryptoJS.lib.WordArray.random(this.BLOCK_SIZE);

    const cipher = CryptoJS.AES.encrypt(customerText, this.encryptionKey, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Append iv as first block of the encryption
    // @ts-ignore - concat is a method on WordArray
    return iv.concat(cipher.ciphertext);
  }

  // signs the encrypted customer data
  private sign(encrypted: CryptoJS.lib.WordArray) {
    return CryptoJS.HmacSHA256(encrypted, this.signingKey);
  }
}
