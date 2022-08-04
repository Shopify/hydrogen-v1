import {defineMiddleware} from '@shopify/hydrogen/config';

export default defineMiddleware(({request, context}) => {
  context.test2 = true;

  if (new URL(request.url).pathname.startsWith('/plugin-middleware')) {
    return new Response('Plugin middleware OK');
  }
});
