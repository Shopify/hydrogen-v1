import {CUSTOMER_ACCESS_TOKEN_COOKIE_NAME} from '../../constants';

export async function api(request, {session}) {
  await session.set(CUSTOMER_ACCESS_TOKEN_COOKIE_NAME, '');

  return new Response(null, {
    headers: {
      Location: '/',
    },
    status: 301,
  });
}
