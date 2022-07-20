import {Link, RSCSubRoute, useRouteParams} from '@shopify/hydrogen';

import {Layout} from '~/components/index.server';
import ProductDetailRoute from './ProductDetailRoute.server';

export default function Product() {
  const {handle} = useRouteParams();
  return (
    <Layout>
      <div className="p-4">
        <div className="flex gap-4">
          <Link
            className="bg-primary rounded text-contrast py-2 px-4 focus:shadow-outline block w-full"
            to="products/snowboard"
          >
            Product A - Snowboard
          </Link>
          <Link
            className="bg-primary rounded text-contrast py-2 px-4 focus:shadow-outline block w-full"
            to="products/the-full-stack"
          >
            Product B - The Full Stack
          </Link>
        </div>
      </div>
      <RSCSubRoute
        state={{handle}}
        path="products/ProductDetailRoute"
        page={<ProductDetailRoute handle={handle} />}
      />
    </Layout>
  );
}
