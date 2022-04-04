import {stringify as stringifyCookie} from 'worktop/cookie';

import {CUSTOMER_ACCESS_TOKEN_COOKIE_NAME} from './constants';
import type {CustomerAccessToken} from '../../storefront-api-types';

export function setCustomerAccessToken({
  accessToken,
  expiresAt,
}: CustomerAccessToken): HeadersInit {
  // return headers to be set on response
  return {
    'Set-Cookie': stringifyCookie(
      CUSTOMER_ACCESS_TOKEN_COOKIE_NAME,
      accessToken,
      {
        httponly: true,
        secure: true,
        samesite: 'Strict',
        path: '/',
        expires: new Date(expiresAt),
      }
    ),
  };
}

export function removeCustomerAccessToken(): HeadersInit {
  // return headers to be set on response
  return {
    'Set-Cookie': stringifyCookie(CUSTOMER_ACCESS_TOKEN_COOKIE_NAME, '', {
      httponly: true,
      secure: true,
      samesite: 'Strict',
      path: '/',
      expires: new Date(1970, 1, 1, 0, 0, 1),
      maxage: 0,
    }),
  };
}
