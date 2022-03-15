import cookie from 'cookie';

import {CUSTOMER_ACCESS_TOKEN_COOKIE_NAME} from '../../constants/cookies';

export async function api(request) {
  // set cookie on server
  request.cookies.delete(CUSTOMER_ACCESS_TOKEN_COOKIE_NAME);

  // set cookie in response
  return new Response(null, {
    headers: {
      'Set-Cookie': cookie.serialize(CUSTOMER_ACCESS_TOKEN_COOKIE_NAME, '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        expires: new Date(1970, 1, 1, 0, 0, 1),
        maxAge: 0,
      }),
    },
    status: 200,
  });
}
