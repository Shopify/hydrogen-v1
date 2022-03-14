import {useShopQuery, flattenConnection, Seo} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import LoadMoreProducts from '../../components/LoadMoreProducts.client';
import Layout from '../../components/Layout.server';
import ProductCard from '../../components/ProductCard';
import NotFound from '../../components/NotFound.server';

export default function Collection({
  country = {isoCode: 'US'},
  collectionProductCount = 24,
  params,
}) {
  const {handle} = params;
  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      handle,
      country: country.isoCode,
      numProducts: collectionProductCount,
    },
    preload: true,
  });

  if (data?.collection == null) {
    return <NotFound />;
  }

  const collection = data.collection;
  const products = flattenConnection(collection.products);
  const hasNextPage = data.collection.products.pageInfo.hasNextPage;

  return (
    <Layout>
      {/* the seo object will be expose in API version 2022-04 or later */}
      <Seo type="collection" data={collection} />
      <h1 className="font-bold text-4xl md:text-5xl text-gray-900 mb-6 mt-6">
        {collection.title}
      </h1>
      <div
        dangerouslySetInnerHTML={{__html: collection.descriptionHtml}}
        className="text-lg"
      />
      <p className="text-sm text-gray-500 mt-5 mb-5">
        {products.length} {products.length > 1 ? 'products' : 'product'}
      </p>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
      {hasNextPage && (
        <LoadMoreProducts startingCount={collectionProductCount} />
      )}
    </Layout>
  );
}

const QUERY = gql`
  query CollectionDetails(
    $handle: String!
    $country: CountryCode
    $numProducts: Int!
    $includeReferenceMetafieldDetails: Boolean = false
    $numProductMetafields: Int = 0
    $numProductVariants: Int = 250
    $numProductMedia: Int = 6
    $numProductVariantMetafields: Int = 0
    $numProductVariantSellingPlanAllocations: Int = 0
    $numProductSellingPlanGroups: Int = 0
    $numProductSellingPlans: Int = 0
  ) @inContext(country: $country) {
    collection(handle: $handle) {
      id
      title
      descriptionHtml
      description
      seo {
        description
        title
      }
      image {
        id
        url
        width
        height
        altText
      }
      products(first: $numProducts) {
        edges {
          node {
            vendor
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
                        reference
                          @include(if: $includeReferenceMetafieldDetails) {
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
                  sellingPlanAllocations(
                    first: $numProductVariantSellingPlanAllocations
                  ) {
                    edges {
                      node {
                        priceAdjustments {
                          compareAtPrice {
                            currencyCode
                            amount
                          }
                          perDeliveryPrice {
                            currencyCode
                            amount
                          }
                          price {
                            currencyCode
                            amount
                          }
                          unitPrice {
                            currencyCode
                            amount
                          }
                        }
                        sellingPlan {
                          id
                          description
                          name
                          options {
                            name
                            value
                          }
                          priceAdjustments {
                            orderCount
                            adjustmentValue {
                              ... on SellingPlanFixedAmountPriceAdjustment {
                                adjustmentAmount {
                                  currencyCode
                                  amount
                                }
                              }
                              ... on SellingPlanFixedPriceAdjustment {
                                price {
                                  currencyCode
                                  amount
                                }
                              }
                              ... on SellingPlanPercentagePriceAdjustment {
                                adjustmentPercentage
                              }
                            }
                          }
                          recurringDeliveries
                        }
                      }
                    }
                  }
                }
              }
            }
            sellingPlanGroups(first: $numProductSellingPlanGroups) {
              edges {
                node {
                  sellingPlans(first: $numProductSellingPlans) {
                    edges {
                      node {
                        id
                        description
                        name
                        options {
                          name
                          value
                        }
                        priceAdjustments {
                          orderCount
                          adjustmentValue {
                            ... on SellingPlanFixedAmountPriceAdjustment {
                              adjustmentAmount {
                                currencyCode
                                amount
                              }
                            }
                            ... on SellingPlanFixedPriceAdjustment {
                              price {
                                currencyCode
                                amount
                              }
                            }
                            ... on SellingPlanPercentagePriceAdjustment {
                              adjustmentPercentage
                            }
                          }
                        }
                        recurringDeliveries
                      }
                    }
                  }
                  appName
                  name
                  options {
                    name
                    values
                  }
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }
`;
