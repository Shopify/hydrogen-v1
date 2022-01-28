import {ShopifyProvider} from '@shopify/hydrogen/client';

export default function ClientConfig({shopifyConfig, children}) {
  return (
    <ShopifyProvider shopifyConfig={shopifyConfig}>{children}</ShopifyProvider>
  );
}
