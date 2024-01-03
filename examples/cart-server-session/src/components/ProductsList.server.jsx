import {
  CacheNone,
  flattenConnection,
  gql,
  useShopQuery,
} from '@shopify/hydrogen';

import {ProductItem} from './ProductItem.server';

export function ProductsList() {
  const {data} = useShopQuery({
    query: GET_PRODUCTS_QUERY,
    cache: CacheNone(),
    preload: '*',
  });

  const products = flattenConnection(data?.products).map((product) => ({
    ...product,
    variants: flattenConnection(product.variants),
  }));

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '2rem',
        alignItems: 'center',
      }}
    >
      {(products || []).map(({id, ...product}) => {
        return (
          <ProductItem
            key={id}
            id={id}
            title={product.title}
            image={product?.image?.thumb}
            variant={product.variants[0]}
          />
        );
      })}
    </div>
  );
}

const GET_PRODUCTS_QUERY = gql`
  query GetProducts {
    products(first: 20) {
      edges {
        node {
          id
          title
          image: featuredImage {
            src
            thumb: url(transform: {maxWidth: 100})
            id
            height
            width
          }
          variants(first: 1) {
            edges {
              node {
                availableForSale
                id
                title
              }
            }
          }
        }
      }
    }
  }
`;
