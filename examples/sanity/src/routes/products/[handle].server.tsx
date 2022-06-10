import { gql, Seo, useRouteParams, useShopQuery } from '@shopify/hydrogen';
import groq from 'groq'
import { useSanityQuery } from '../../../hooks/useSanityQuery';
import { Product } from '@shopify/hydrogen/dist/esnext/storefront-api-types';

type ProductPage = {
  store: {
    _id: string;
    gid: string;
    vendor?: string;
  }
  body: any;
  sanitySeo: {
    title: string;
    description: string;
    image: {
      asset: {
        url: string;
      }
    }
  }
}

type ShopifyPayload = {
  product: Pick<
    Product,
    'handle' | 'id' | 'media' | 'seo' | 'title' | 'variants' | 'vendor' | 'description'
  >;
};

export default function ProductRoute() {
  const {handle} = useRouteParams();
  const {data: sanityProduct} = useSanityQuery<ProductPage>({
    query: QUERY_SANITY,
    params: {slug: handle}
  })
  const {sanitySeo} = sanityProduct
  /**
   * Conditionally fetch Shopify data if the product is found in Sanity
   */
  let storefrontProduct
  if (sanityProduct?.store?.gid) {
    const {data: shopifyProduct} = useShopQuery<ShopifyPayload>({
      query: QUERY_SHOPIFY,
      variables: {
        id: sanityProduct?.store?.gid
      }
    })

    storefrontProduct = shopifyProduct?.product
  }
  if (!sanityProduct || !storefrontProduct) {
    return <main><h1>Sorry, we couldn't find the product you were looking for.</h1></main>
  }

  return (<main>
    <a href="/">⬅ Home</a>
    <h1>{storefrontProduct?.title} — {sanityProduct?.store?.vendor}</h1>
    <p>{storefrontProduct?.description}</p>
    <Seo
      data={{
        ...(sanitySeo.image ? {
          featuredImage: {
            height: sanitySeo.image.height,
            url: sanitySeo.image.url,
            width: sanitySeo.image.width,
          },
        } : {}),
        seo: {
          description: sanitySeo.description,
          title: sanitySeo.title,
        },
      }}
      type="product"
    />
  </main>);
}

const QUERY_SANITY = groq`
  *[
    _type == "product"
    && store.slug.current == $slug
  ][0]
`

const QUERY_SHOPIFY = gql`
  query product($id: ID!) {
    product(id: $id) {
      handle
      id
      title
      description
   }
  }
`