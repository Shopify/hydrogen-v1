import {parse, stringify} from 'worktop/cookie';
import type {Attributes} from 'worktop/cookie';

export type CookieOptions = Attributes;

export function getCookie(key: string): string | undefined {
  const cookies = parse(document.cookie);
  return cookies[key];
}

export function setCookie(key: string, value: string, options?: CookieOptions) {
  document.cookie = stringify(key, value, options);
}

// ----------------------------------------------------------------------------
// If cookie exists, check that it matches expectedValue, otherwise return false
export function validateCookie(key: string, expectedValue: string): boolean {
  const cookieVal = getCookie(key);
  if (cookieVal) {
    return cookieVal === expectedValue;
  } else {
    return false;
  }
}
