import {ShopifyProvider} from '@shopify/hydrogen';
import shopifyConfig from '../shopify.config';

export default function App() {
  return (
    <ShopifyProvider shopifyConfig={shopifyConfig}>
      {/* Routes, Pages, etc */}
    </ShopifyProvider>
  );
}
