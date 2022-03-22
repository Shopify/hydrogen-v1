import {stringify as stringifyCookie} from 'worktop/cookie';

import {CUSTOMER_ACCESS_TOKEN_COOKIE_NAME} from '../../constants/cookies';

export function api() {
  return new Response(null, {
    headers: {
      Location: '/',
      'Set-Cookie': stringifyCookie(CUSTOMER_ACCESS_TOKEN_COOKIE_NAME, '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        expires: new Date(1970, 1, 1, 0, 0, 1),
        maxAge: 0,
      }),
    },
    status: 301,
  });
}
