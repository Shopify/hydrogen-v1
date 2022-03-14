import {useShopQuery, flattenConnection} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import Layout from './Layout.server';
import Button from './Button.client';
import ProductCard from './ProductCard';

/**
 * A server component that defines the content to display when a page isn't found (404 error)
 */
function NotFoundHero() {
  return (
    <div className="py-10 border-b border-gray-200">
      <div className="max-w-3xl text-center mx-4 md:mx-auto">
        <h1 className="font-bold text-4xl md:text-5xl text-gray-900 mb-6 mt-6">
          We&#39;ve lost this page
        </h1>
        <p className="text-lg m-8 text-gray-500">
          We couldn’t find the page you’re looking for. Try checking the URL or
          heading back to the home page.
        </p>
        <Button
          className="w-full md:mx-auto md:w-96"
          url="/"
          label="Take me to the home page"
        />
      </div>
    </div>
  );
}

export default function NotFound({country = {isoCode: 'US'}, response}) {
  if (response) {
    response.doNotStream();
    response.writeHead({status: 404, statusText: 'Not found'});
  }

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      country: country.isoCode,
      numProductMetafields: 0,
      numProductVariants: 250,
      numProductMedia: 0,
      numProductVariantMetafields: 0,
      numProductVariantSellingPlanAllocations: 0,
      numProductSellingPlanGroups: 0,
      numProductSellingPlans: 0,
    },
  });
  const products = data ? flattenConnection(data.products) : [];

  return (
    <Layout>
      <NotFoundHero />
      <div className="my-8">
        <p className="mb-8 text-lg text-black font-medium uppercase">
          Products you might like
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

const QUERY = gql`
  query NotFoundProductDetails(
    $country: CountryCode
    $includeReferenceMetafieldDetails: Boolean = false
    $numProductMetafields: Int!
    $numProductVariants: Int!
    $numProductMedia: Int!
    $numProductVariantMetafields: Int!
    $numProductVariantSellingPlanAllocations: Int!
    $numProductSellingPlanGroups: Int!
    $numProductSellingPlans: Int!
  ) @inContext(country: $country) {
    products(first: 3) {
      edges {
        node {
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
    }
  }
`;
