import {useShopQuery, Seo, useRouteParams} from '@shopify/hydrogen';
import {ProductProviderFragment} from '@shopify/hydrogen/fragments';
import gql from 'graphql-tag';

import ProductDetails from '../../components/ProductDetails.client';
import NotFound from '../../components/NotFound.server';
import Layout from '../../components/Layout.server';

export default function Product({country = {isoCode: 'US'}}) {
  const {handle} = useRouteParams();

  const {
    data: {product},
  } = useShopQuery({
    query: QUERY,
    variables: {
      country: country.isoCode,
      handle,
    },
    preload: true,
  });

  if (!product) {
    return <NotFound />;
  }

  return (
    <Layout>
      <Seo type="product" data={product} />
      <ProductDetails product={product} />
    </Layout>
  );
}

const QUERY = gql`
  query product(
    $country: CountryCode
    $handle: String!
    $includeReferenceMetafieldDetails: Boolean = true
    $numProductMetafields: Int = 20
    $numProductVariants: Int = 250
    $numProductMedia: Int = 6
    $numProductVariantMetafields: Int = 10
    $numProductVariantSellingPlanAllocations: Int = 0
    $numProductSellingPlanGroups: Int = 0
    $numProductSellingPlans: Int = 0
  ) @inContext(country: $country) {
    product: product(handle: $handle) {
      id
      vendor
      ...ProductProviderFragment
      title
      description
      seo {
        description
        title
      }
      vendor
      featuredImage {
        url
        width
        height
        altText
      }
      variants(first: $numProductVariants) {
        edges {
          node {
            image {
              url
            }
            availableForSale
            priceV2 {
              amount
              currencyCode
            }
            sku
          }
        }
      }
    }
  }

  ${ProductProviderFragment}
`;
