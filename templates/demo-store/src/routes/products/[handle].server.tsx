import {RSCSubRoute, useRouteParams} from '@shopify/hydrogen';

import {Layout} from '~/components/index.server';
import ProductDetailRoute from './ProductDetailRoute.server';

export default function Product() {
  const {handle} = useRouteParams();
  return (
    <Layout>
      <RSCSubRoute
        state={{handle}}
        path="products/ProductDetailRoute"
        page={<ProductDetailRoute handle={handle} />}
      />
    </Layout>
  );
}
