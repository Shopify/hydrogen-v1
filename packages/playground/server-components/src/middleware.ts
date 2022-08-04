import {defineMiddleware} from '@shopify/hydrogen/config';

export default defineMiddleware(({request}) => {
  if (new URL(request.url).pathname.startsWith('/app-middleware')) {
    return new Response('App middleware OK');
  }
});
