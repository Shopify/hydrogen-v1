## Storefront API data

The `data` prop is an object with fields that correspond to the Storefront API's [Product object](/api/storefront/reference/products/product):

```graphql
{
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
```

### Variables

The [Product object](/api/storefront/reference/products/product) includes variables that you will need to provide values for when performing your query.

| Variable                                   | Description                                                                                           |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `$numProductMedia`                         | The number of `Media` objects to query for in a `MediaConnection`.                                    |
| `$numProductMetafields`                    | The number of `Metafields` objects to query for in a `MetafieldConnection`.                           |
| `$numProductVariants`                      | The number of `ProductVariant` objects to query for in a `ProductVariantConnection`.                  |
| `$numProductVariantMetafields`             | The number of `Metafield` objects to query for in a variant's `MetafieldConnection`.                  |
| `$numProductVariantSellingPlanAllocations` | The number of `SellingPlanAllocations` to query for in a variant's `SellingPlanAllocationConnection`. |
| `$numProductSellingPlanGroups`             | The number of `SellingPlanGroups` objects to query for in a `SellingPlanGroupConnection`.             |
| `$numProductSellingPlans`                  | The number of `SellingPlan` objects to query for in a `SellingPlanConnection`.                        |
| `$includeReferenceMetafieldDetails`        | A boolean indicating if the reference metafield details should be queried.                            |

### Example query

```jsx
export default function Product() {
  const {handle} = useRouteParams();

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      handle,
      numProductMetafields: 10,
      numProductVariants: 250,
      numProductMedia: 6,
      numProductVariantMetafields: 10,
      numProductVariantSellingPlanAllocations: 10,
      numProductSellingPlanGroups: 10,
      numProductSellingPlans: 10,
      includeReferenceMetafieldDetails: false,
    },
  });

  if (!data.product) {
    return <NotFound />;
  }

  return <ProductDetails data={data} />;
}

const QUERY = gql`
  query product(
    $handle: String!
    $numProductMetafields: Int!
    $numProductVariants: Int!
    $numProductMedia: Int!
    $numProductVariantMetafields: Int!
    $numProductVariantSellingPlanAllocations: Int!
    $numProductSellingPlanGroups: Int!
    $numProductSellingPlans: Int!
    $includeReferenceMetafieldDetails: Boolean!
  ) {
    product: product(handle: $handle) {
      id
      vendor
      seo {
        title
        description
      }
      featuredImage {
        url
      }
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
`;
```
