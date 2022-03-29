import {useShopQuery, Seo, useRouteParams, useQuery} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import ProductDetails from '../../components/ProductDetails.client';
import NotFound from '../../components/NotFound.server';
import Layout from '../../components/Layout.server';
import {Suspense} from 'react';
import ProductCard from '../../components/ProductCard';

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
      <Suspense fallback={<GenericFallback />}>
        <RelatedProducts title="New Arrivals" endpoint="/new_arrivals" />
      </Suspense>
      <Suspense fallback={<GenericFallback />}>
        <RelatedProducts
          title="Recommend for you"
          endpoint="/recommendations/user"
        />
      </Suspense>
      <Suspense fallback={<GenericFallback />}>
        <RelatedProducts
          title="Products related to this item"
          endpoint="/recommendations/product"
        />
      </Suspense>
      <Suspense fallback={<GenericFallback />}>
        <RelatedProducts
          title="Customers who viewed this item also viewed"
          endpoint="/recommendations/others"
        />
      </Suspense>
    </Layout>
  );
}

function GenericFallback() {
  return <div className="h-48 w-full bg-gray-300" />;
}

function RelatedProducts({title = 'New Arrivals', endpoint}) {
  const {data: products} = useQuery(endpoint, async () =>
    fetch(`https://fake-commerce-api.jplhomer.workers.dev${endpoint}`).then(
      (r) => r.json(),
    ),
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8 text-md font-medium">
        <span className="text-black uppercase">{title}</span>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}

const QUERY = gql`
  query product($country: CountryCode, $handle: String!)
  @inContext(country: $country) {
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
      media(first: 6) {
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
      metafields(first: 20) {
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
        edges {
          node {
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
      vendor
    }
  }
`;
