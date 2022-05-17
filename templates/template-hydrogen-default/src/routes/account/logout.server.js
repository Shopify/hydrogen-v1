import {removeCustomerAccessToken} from '@shopify/hydrogen';

export async function api(request, {session}) {
  if (request.method !== 'POST')
    return new Response('Post required to logout', {
      status: 405,
      headers: {
        Allow: 'POST',
      },
    });

  await removeCustomerAccessToken(session);

  return new Response();
}
