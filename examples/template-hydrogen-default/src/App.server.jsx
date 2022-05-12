import renderHydrogen from '@shopify/hydrogen/entry-server';
import {
  CookieSessionStorage,
  Router,
  FileRoutes,
  ShopifyProvider,
} from '@shopify/hydrogen';
import shopifyConfig from '../shopify.config';

import Header from './rscComponent/Header.server';
import Footer from './rscComponent/Footer.server';
import ProductDetails from './rscComponent/ProductDetails.server';
import CollectionDetails from './rscComponent/CollectionDetails.server';
import Wizardlyhel from './rscComponent/Wizardlyhel.server';
import Wizardlyhel2 from './rscComponent/Wizardlyhel2.server';
import Welcome from './rscComponent/Welcome.server';

import Product from './routes/product.server';
import Collection from './routes/collection.server';

function App({routes, ssrMode}) {
  return (
    <ShopifyProvider shopifyConfig={shopifyConfig}>
      <Router>
        <FileRoutes routes={routes} ssrMode={ssrMode} />
      </Router>
    </ShopifyProvider>
  );
}

const routes = import.meta.globEager('./routes/**/*.server.[jt](s|sx)');

export default renderHydrogen(App, {
  routes,
  shopifyConfig,
  session: CookieSessionStorage('__session', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
  }),
  componentManifest: {
    Header: Header,
    ProductDetails: ProductDetails,
    Footer: Footer,
    CollectionDetails: CollectionDetails,
    Product: Product,
    Collection: Collection,
    Wizardlyhel: Wizardlyhel,
    Wizardlyhel2: Wizardlyhel2,
    Welcome: Welcome,
  },
});
