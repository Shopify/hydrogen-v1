import {useShopQuery, Seo, useRouteParams} from '@shopify/hydrogen';
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
  ) @inContext(country: $country) {
    product: product(handle: $handle) {
      compareAtPriceRange {
        maxVariantPrice {
          currencyCode
          amount
        }
        minVariantPrice {
          currencyCode
          amount
        }
      }
      descriptionHtml
      handle
      id
      media(first: $numProductMedia) {
        edges {
          node {
            ... on MediaImage {
              mediaContentType
              image {
                id
                url
                altText
                width
                height
              }
            }
            ... on Video {
              mediaContentType
              id
              previewImage {
                url
              }
              sources {
                mimeType
                url
              }
            }
            ... on ExternalVideo {
              mediaContentType
              id
              embedUrl
              host
            }
            ... on Model3d {
              mediaContentType
              id
              alt
              mediaContentType
              previewImage {
                url
              }
              sources {
                url
              }
            }
          }
        }
      }
      metafields(first: $numProductMetafields) {
        edges {
          node {
            id
            type
            namespace
            key
            value
            createdAt
            updatedAt
            description
            reference @include(if: $includeReferenceMetafieldDetails) {
              __typename
              ... on MediaImage {
                id
                mediaContentType
                image {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
        }
      }
      priceRange {
        maxVariantPrice {
          currencyCode
          amount
        }
        minVariantPrice {
          currencyCode
          amount
        }
      }
      title
      variants(first: $numProductVariants) {
        edges {
          node {
            id
            title
            availableForSale
            image {
              id
              url
              altText
              width
              height
            }
            unitPriceMeasurement {
              measuredType
              quantityUnit
              quantityValue
              referenceUnit
              referenceValue
            }
            unitPrice {
              currencyCode
              amount
            }
            priceV2 {
              currencyCode
              amount
            }
            compareAtPriceV2 {
              currencyCode
              amount
            }
            selectedOptions {
              name
              value
            }
            metafields(first: $numProductVariantMetafields) {
              edges {
                node {
                  id
                  type
                  namespace
                  key
                  value
                  createdAt
                  updatedAt
                  description
                  reference @include(if: $includeReferenceMetafieldDetails) {
                    __typename
                    ... on MediaImage {
                      id
                      mediaContentType
                      image {
                        id
                        url
                        altText
                        width
                        height
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
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
`;
