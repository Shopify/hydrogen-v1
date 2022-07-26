import type {CustomerInfo} from './index.server';

/*
  Shopify Multipass implementation for Worker runtime based on
  the native Web Crypto API.
  ------------------------------------------------------------
  [domain] {string} The domain of the shopify store.
  [secret] {string} The shopify store's multipass secret.
  [customer] {object} The customer data to be used to login to the shopify store.
  ------------------------------------------------------------
  @see: https://shopify.dev/api/multipass — Shopify multipass
  @see: https://github.com/beaucoo/multipassify — Previous art for NodeJS runtimes
*/

interface MultipassOptions {
  domain?: string; // The domain of the shopify store. `xyz.myshopify.com`
  secret?: string; // The shopify store's multipass secret. `abcdefghijklmnopqrstuvwxyz`
  customer?: {
    created_at?: string | Date;
    return_to?: string; // The URL to redirect to after login.
  } & CustomerInfo;
}

export async function multipass(options: MultipassOptions) {
  validate(options);

  const {domain, secret, customer} = options;

  if (!customer?.created_at || !(customer.created_at instanceof Date)) {
    // @ts-ignore - customer will be defined because validate() would throw otherwise
    customer.created_at = new Date().toISOString();
  }

  const BLOCK_SIZE = 16;
  const encoder = new TextEncoder();

  // encode out inputs
  const encoded = {
    secret: encoder.encode(secret),
    customer: encoder.encode(JSON.stringify(customer)),
  };

  // Use the multipass secret to derive two cryptographic keys,
  const digest = await crypto.subtle.digest({name: 'SHA-256'}, encoded.secret);

  const encryptionKey = await crypto.subtle.importKey(
    'raw',
    digest.slice(0, BLOCK_SIZE),
    {name: 'AES-CBC', length: 128},
    false,
    ['encrypt'],
  );

  const signingKey = await crypto.subtle.importKey(
    'raw',
    digest.slice(BLOCK_SIZE, 32),
    {name: 'HMAC', hash: 'SHA-256'}, // algorithm @see: https://w3c.github.io/webcrypto/#jwk-mapping-alg
    false, // extractable
    ['sign'],
  );

  // random iv used for encryption
  const iv = crypto.getRandomValues(new Uint8Array(BLOCK_SIZE));

  // encrypt the passed data with the encryption key - @see: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt#aes-cbc_2
  const _encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-CBC',
      iv,
      length: 128,
    },
    encryptionKey,
    encoded.customer,
  );

  // multipass expects iv to be appended to the encrypted data
  const encrypted = appendBuffer(iv.buffer, _encrypted);

  // sign encrypted data with the sign key -  @see: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign#hmac_2//
  const signature = await crypto.subtle.sign('HMAC', signingKey, encrypted);

  // merge the encrypted data with the signature
  const token = appendBuffer(encrypted, signature);

  // base64 encode the token
  const base64Token = btoa(String.fromCharCode(...new Uint8Array(token)));

  const safeBase64Token = base64Token
    .replace(/\+/g, '-') // Replace + with -
    .replace(/\//g, '_'); // Replace / with _

  return {
    url: `https://${domain}/account/login/multipass/${safeBase64Token}`,
    token: safeBase64Token,
  };
}

/**
 * Validates the required options passed to the multipass function.
 */
function validate(options: MultipassOptions) {
  const {domain, secret, customer} = options;
  if (!domain) {
    throw new Error('domain not provided');
  }
  if (!secret) {
    throw new Error('secret not provided');
  }
  if (!customer) {
    throw new Error('customer not provided');
  }
  if (!customer?.email) {
    throw new Error('customer must contain an `email` property');
  }
}

/**
 * Appends a buffer to another buffer.
 */
function appendBuffer(buffer1: ArrayBuffer, buffer2: ArrayBuffer) {
  const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp.buffer;
}
