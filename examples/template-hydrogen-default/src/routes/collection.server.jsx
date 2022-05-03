import {Suspense} from 'react';
import {SSRSCWrapper} from '@shopify/hydrogen';
import LoadingFallback from '../components/LoadingFallback';

import CollectionDetails from '../rscComponent/CollectionDetails.server';
import Header from '../rscComponent/Header.server';
import Footer from '../rscComponent/Footer.server';

export default function Collection({ssrMode}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SSRSCWrapper componentId="Header" Component={Header} ssrMode={ssrMode} />
      <h1>Collection</h1>
      <SSRSCWrapper
        componentId="CollectionDetails"
        Component={CollectionDetails}
        ssrMode={ssrMode}
      />
      <SSRSCWrapper componentId="Footer" Component={Footer} ssrMode={ssrMode} />
    </Suspense>
  );
}
