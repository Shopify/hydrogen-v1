import {Suspense} from 'react';
import {SSRSCWrapper} from '@shopify/hydrogen';
import LoadingFallback from '../components/LoadingFallback';

import ProductDetails from '../rscComponent/ProductDetails.server';
import Header from '../rscComponent/Header.server';
import Footer from '../rscComponent/Footer.server';
import WizardlyhelWrapper from '../rscComponent/WizardlyhelWrapper.server';

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
        componentId="WizardlyhelWrapper"
        Component={WizardlyhelWrapper}
        ssrMode={ssrMode}
      />
      <SSRSCWrapper componentId="Footer" Component={Footer} ssrMode={ssrMode} />
    </Suspense>
  );
}
