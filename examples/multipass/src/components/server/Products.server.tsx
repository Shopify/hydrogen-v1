import {flattenConnection, gql, useShopQuery} from '@shopify/hydrogen';

import {ProductItem} from '~/components/client';

const PRODUCT_ITEMS_QUERY = gql`
  query Products {
    products(first: 8) {
      edges {
        node {
          title
          id
          variants(first: 1) {
            edges {
              node {
                id
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

export function Products() {
  const {data, error} = useShopQuery({
    query: PRODUCT_ITEMS_QUERY,
  });

  const products = flattenConnection(data?.products);

  return (
    <div>
      {error && <p>{error.message}</p>}
      {products && (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)'}}>
          {products.map((product) => (
            <ProductItem product={product} key={product.id} />
          ))}
        </div>
      )}
    </div>
  );
}
