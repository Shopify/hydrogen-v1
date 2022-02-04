import renderHydrogen from '@shopify/hydrogen/entry-client';

function ClientApp({children}) {
  return children;
}

export default renderHydrogen(ClientApp, {});
