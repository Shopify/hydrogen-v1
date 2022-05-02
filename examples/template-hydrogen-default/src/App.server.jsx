import renderHydrogen from '@shopify/hydrogen/entry-server';
import {CookieSessionStorage} from '@shopify/hydrogen';
import {Suspense} from 'react';
import shopifyConfig from '../shopify.config';
import LoadingFallback from './components/LoadingFallback';
import Header from './rscComponent/Header.server';
import Footer from './rscComponent/Footer.server';
import ProductDetails from './rscComponent/ProductDetails.server';
import {SSRSCWrapper} from '@shopify/hydrogen';

function App({routes, ssrMode}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SSRSCWrapper componentId="Header" ssrMode={ssrMode} Component={Header} />
      <SSRSCWrapper
        componentId="ProductDetails"
        ssrMode={ssrMode}
        Component={ProductDetails}
      />
      <SSRSCWrapper componentId="Footer" ssrMode={ssrMode} Component={Footer} />
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
