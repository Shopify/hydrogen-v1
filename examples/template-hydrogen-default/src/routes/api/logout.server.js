import {removeCustomerAccessToken} from '@shopify/hydrogen';

export function api() {
  const removeCustomerHeaders = removeCustomerAccessToken();

  return new Response(null, {
    headers: {
      ...removeCustomerHeaders,
      Location: '/',
    },
    status: 301,
  });
}
