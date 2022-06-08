import {
  useSession,
  useShop,
  useShopQuery,
  Seo,
  useRouteParams,
  useServerAnalytics,
  ShopifyAnalyticsConstants,
  gql,
} from '@shopify/hydrogen';

import ProductDetails from '../../components/ProductDetails.client';
import NotFound from '../../components/NotFound.server';
import Layout from '../../components/Layout.server';

export default function Product() {
  const {handle} = useRouteParams();
  const {countryCode = 'US'} = useSession();

  const {languageCode} = useShop();

  const {
    data: {product},
  } = useShopQuery({
    query: QUERY,
    variables: {
      country: countryCode,
      language: languageCode,
      handle,
    },
    preload: true,
  });

  useServerAnalytics(
    product
      ? {
          shopify: {
            pageType: ShopifyAnalyticsConstants.pageType.product,
            resourceId: product.id,
          },
        }
      : null,
  );

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
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
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
      description
      descriptionHtml
      featuredImage {
        url
        width
        height
        altText
      }
      handle
      id
      vendor
      media(first: 6) {
        nodes {
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
      metafields(first: 20) {
        nodes {
          id
          type
          namespace
          key
          value
          createdAt
          updatedAt
          description
          reference {
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
      seo {
        description
        title
      }
      title
      variants(first: 250) {
        nodes {
          availableForSale
          compareAtPriceV2 {
            amount
            currencyCode
          }
          id
          image {
            id
            url
            altText
            width
            height
          }
          metafields(first: 10) {
            nodes {
              id
              type
              namespace
              key
              value
              createdAt
              updatedAt
              description
              reference {
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
          priceV2 {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          sku
          title
          unitPrice {
            amount
            currencyCode
          }
          unitPriceMeasurement {
            measuredType
            quantityUnit
            quantityValue
            referenceUnit
            referenceValue
          }
        }
      }
    }
  }
`;
