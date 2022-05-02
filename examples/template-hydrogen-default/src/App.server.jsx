import renderHydrogen from '@shopify/hydrogen/entry-server';
import {CookieSessionStorage} from '@shopify/hydrogen';
import {Suspense} from 'react';
import shopifyConfig from '../shopify.config';
import LoadingFallback from './components/LoadingFallback';
import Header from './rscComponent/Header.server';
import Footer from './rscComponent/Footer.server';
import ProductDetails from './rscComponent/ProductDetails.server';
import {RSCWrapper} from '@shopify/hydrogen/client';

function App({routes}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RSCWrapper componentId="Header" />
      <RSCWrapper componentId="ProductDetails" component={<ProductDetails />} />
      <RSCWrapper componentId="Footer" component={<Footer />} />
    </Suspense>
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
  },
});
