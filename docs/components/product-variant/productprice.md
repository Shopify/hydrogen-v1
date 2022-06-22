---
gid: 7326d7ca-fafe-11eb-9a03-0242ac130003
title: ProductPrice
description: The ProductPrice component renders a Money component with the product priceRange's maxVariantPrice or minVariantPrice, for either the regular price or compare at price range.
---

The `ProductPrice` component renders a [`Money`](https://shopify.dev/api/hydrogen/components/primitive/money) component with the product
[`priceRange`](https://shopify.dev/api/storefront/reference/products/productpricerange)'s `maxVariantPrice` or `minVariantPrice`, for either the regular price or compare at price range.

## Example code

```tsx
import {ProductPrice, gql} from '@shopify/hydrogen';

export function Product() {
  const {data} = useShopQuery({query: QUERY});

  return (
    <ProductPrice data={product} priceType="compareAt" valueType="max" />
  );
}

  const QUERY = gql`
    query product($handle: String!) {
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
      metafields(first: $numProductMetafields) {
        nodes {
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
        nodes {
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
            nodes {
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
          sellingPlanAllocations(
            first: $numProductVariantSellingPlanAllocations
          ) {
            nodes {
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
      sellingPlanGroups(first: $numProductSellingPlanGroups) {
        nodes {
          sellingPlans(first: $numProductSellingPlans) {
            nodes {
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
  `
```

## Props

| Name       | Type                                          | Description                                                          |
| ---------- | --------------------------------------------- | -------------------------------------------------------------------- |
| data | <code>PartialDeep<<wbr>Product<wbr>></code>  | An object with fields that correspond to the Storefront API's [Product object](/api/storefront/reference/products/product). |
| priceType? | <code>"regular" &#124; "compareAt"</code>     | The type of price. Valid values: `regular` (default) or `compareAt`. |
| valueType? | <code>"max" &#124; "min" &#124; "unit"</code> | The type of value. Valid values: `min` (default), `max`, or `unit`.  |
| variantId? | <code>string</code>                           | The ID of the variant.                                               |

## Component type

The `ProductPrice` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`ProductOptionsProvider`](https://shopify.dev/api/hydrogen/components/product-variant/productoptionsprovider)
- [`Money`](https://shopify.dev/api/hydrogen/components/primitive/money)
