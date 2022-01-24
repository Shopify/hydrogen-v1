import {useProductQuery} from '@shopify/hydrogen';

import ProductDetails from '../../components/ProductDetails.client';
import NotFound from '../../components/NotFound.server';
import Layout from '../../components/Layout.server';

export default function Product({country = {isoCode: 'US'}, params}) {
  const {handle} = params;

  const {data} = useProductQuery({handle, country: country.isoCode});

  if (!data.product) {
    return <NotFound />;
  }

  return (
    <Layout>
      <ProductDetails product={data.product} />
    </Layout>
  );
}
