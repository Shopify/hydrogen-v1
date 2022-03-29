import cookie from 'cookie';

export type CookieSerializeOptions = cookie.CookieSerializeOptions;

export function getCookie(key: string): string | undefined {
  const cookies = cookie.parse(document.cookie);
  return cookies[key];
}

export function setCookie(
  key: string,
  value: string,
  options?: cookie.CookieSerializeOptions
) {
  document.cookie = cookie.serialize(key, value, options);
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
