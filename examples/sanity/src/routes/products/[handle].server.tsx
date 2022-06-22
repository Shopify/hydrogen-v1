import {gql, useRouteParams, useShopQuery} from '@shopify/hydrogen';
import {Product} from '@shopify/hydrogen/dist/esnext/storefront-api-types';
import groq from 'groq';
import {useSanityQuery} from '../../../hooks/useSanityQuery';

export default function ProductRoute() {
  const {handle} = useRouteParams();
  const {data: sanityProduct} = useSanityQuery({
    query: QUERY_SANITY,
    params: {slug: handle},
  });
  /**
   * Conditionally fetch Shopify data if the product is found in Sanity
   */
  let storefrontProduct;
  if (sanityProduct?.store?.gid) {
    const {data: shopifyProduct} = useShopQuery<{product: Product}>({
      query: QUERY_SHOPIFY,
      variables: {
        id: sanityProduct?.store?.gid,
      },
    });

    storefrontProduct = shopifyProduct?.product;
  }
  if (!sanityProduct || !storefrontProduct) {
    return (
      <main>
        <h1>Sorry, we couldn't find the product you were looking for.</h1>
      </main>
    );
  }

  return (
    <main>
      <a href="/">⬅ Home</a>
      <h1>
        {storefrontProduct?.title} — {sanityProduct?.store?.vendor}
      </h1>
      <p>{storefrontProduct?.description}</p>
    </main>
  );
}

const QUERY_SANITY = groq`
  *[
    _type == "product"
    && store.slug.current == $slug
  ][0]
`;

const QUERY_SHOPIFY = gql`
  query product($id: ID!) {
    product(id: $id) {
      handle
      id
      title
      description
    }
  }
`;
