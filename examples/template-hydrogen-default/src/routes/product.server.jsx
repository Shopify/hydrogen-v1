import {Suspense} from 'react';
import {SSRSCWrapper} from '@shopify/hydrogen';
import LoadingFallback from '../components/LoadingFallback';

import ProductDetails from '../rscComponent/ProductDetails.server';
import Header from '../rscComponent/Header.server';
import Footer from '../rscComponent/Footer.server';
import Wizardlyhel from '../rscComponent/Wizardlyhel.server';

export default function Product({ssrMode}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SSRSCWrapper componentId="Header" Component={Header} ssrMode={ssrMode} />
      <h1>Product</h1>
      <SSRSCWrapper
        componentId="ProductDetails"
        Component={ProductDetails}
        ssrMode={ssrMode}
      />
      <SSRSCWrapper
        componentId="Wizardlyhel"
        Component={Wizardlyhel}
        ssrMode={ssrMode}
      />
      <SSRSCWrapper componentId="Footer" Component={Footer} ssrMode={ssrMode} />
    </Suspense>
  );
}
