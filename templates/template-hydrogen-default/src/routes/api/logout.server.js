import {removeCustomerAccessToken} from '@shopify/hydrogen';

export async function api(_request, {session}) {
  await removeCustomerAccessToken(session);

  return new Response(null, {
    headers: {
      Location: '/',
    },
    status: 301,
  });
}
