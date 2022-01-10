import renderHydrogen, {refresh} from '@shopify/hydrogen/entry-client';
import {ShopifyProvider} from '@shopify/hydrogen/client';
import shopifyConfig from '../shopify.config';

if (import.meta.hot) {
  import.meta.hot.on('client-component', (changedFile) => {
    const serverState = {
      pathname: window.location.pathname,
      search: window.location.search,
    };
    const key = JSON.stringify(serverState);
    refresh(key, changedFile);
    console.log(`[vite] hot updated: ${changedFile}`);
  });
}
function ClientApp({children}) {
  return (
    <ShopifyProvider shopifyConfig={shopifyConfig}>{children}</ShopifyProvider>
  );
}

export default renderHydrogen(ClientApp);
