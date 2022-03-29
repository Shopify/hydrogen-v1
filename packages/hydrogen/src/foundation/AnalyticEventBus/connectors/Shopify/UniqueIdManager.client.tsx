import {getCookie, setCookie, validateCookie} from '../../Cookie.client';
import {buildUUID} from './utils';

import type {CookieSerializeOptions} from '../../Cookie.client';

const defaultDisallowedCookieVal = '00000000-0000-0000-5000-000000000000';
const longTermKey = '_shopify_y';
const myShopifyDomain = 'myshopify.com';
const tempDomainKey = '_shopify_d';
const longTermLength = 60 * 60 * 24 * 360; // ~1 year expiry

let cookieDomain: string;

export function getClientId() {
  determineCookieDomain();
  return getOrSet(longTermKey, {
    maxAge: longTermLength,
    domain: cookieDomain,
    sameSite: 'lax',
  });
}

// Functions extracted from Shopify Trekkie

function getOrSet(key: string, options?: CookieSerializeOptions): string {
  let token = getCookie(key);
  let writeCookie = false;

  if (!token) {
    token = buildUUID();
    writeCookie = true;
  }

  if (writeCookie) {
    setCookie(key, token, options);
  }

  const cookieValue = getCookie(key);

  if (cookieValue === undefined) {
    return defaultDisallowedCookieVal;
  } else {
    return cookieValue;
  }
}

function determineCookieDomain(): void {
  if (typeof cookieDomain !== 'undefined') {
    return;
  }

  // If it is a myshopify.com domain, then we want to explicitly set the cookie on the subdomain, which can be done by
  // not passing in a domain when setting the cookie
  if (!isMyshopifyDotComHost()) {
    const subdomains = location.hostname.split('.').reverse();
    let domain = '';
    for (const subdomain of subdomains) {
      if (domain === '') {
        domain = `.${subdomain}`;
      } else {
        domain = `.${subdomain}${domain}`;
      }

      const tempDomainValue = generateShopifyDValue();
      writeForDomain(tempDomainKey, tempDomainValue, 0, domain);
      if (validateCookie(tempDomainKey, tempDomainValue)) {
        writeForDomain(tempDomainKey, tempDomainValue, -1, domain);
        cookieDomain = domain;
        return;
      }
    }
  } else {
    cookieDomain = location.hostname;
    return;
  }

  // If writing to expanding domains doesn't work, write cookie without explicit domain and let browser set the domain
  cookieDomain = '';
}

function writeForDomain(
  key: string,
  val: string,
  maxAge: number,
  domain: string
): void {
  setCookie(key, val, {
    domain,
    path: '/',
    maxAge,
    sameSite: 'lax',
  });
}

function isMyshopifyDotComHost(): boolean {
  return location.hostname.indexOf(myShopifyDomain) !== -1;
}

function generateShopifyDValue(): string {
  return new Date().toJSON();
}
