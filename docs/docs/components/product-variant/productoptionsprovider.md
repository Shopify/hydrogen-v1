# ProductOptionsProvider


The `ProductOptionsProvider` component sets up a context with state that tracks the selected variant and options. Descendents of this component can use the [`useProductOptions`](/hooks/product-variant/useproductoptions/) hook.

## Example code

```tsx
import {ProductOptionsProvider, gql} from '@shopify/hydrogen';

const QUERY = gql`
  query product($handle: String!, $includeReferenceMetafieldDetails: Boolean!) {
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
      media(first: 10) {
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
      variants(first: 250) {
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
            first: 10
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
      sellingPlanGroups(first: 10) {
        nodes {
          sellingPlans(first: 10) {
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
`;

export function Product() {
  const {data} = useShopQuery({query: QUERY, variables: { handle, includeReferenceMetafieldDetails }});

  return (
    <ProductOptionsProvider data={data.product} initialVariantId="some-id">{/* Your JSX */}</ProductOptionsProvider>
  );
}
```

## Props

| Name              | Type                                                                              | Description                                                                                                                                                                                                     |
| ----------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| children          | `ReactNode`                                                            | A `ReactNode` element.                                                                                                                                                                                          |
| data              | `PartialDeep&#60;ProductType&#62;`                                     | An object with fields that correspond to the Storefront API's [Product object](https://shopify.dev/docs/api/storefront/reference/products/product).                                                                  |
| initialVariantId? | `Parameters&#60;typeof useProductOption&#62;['0']['initialvariantid']` | The initially selected variant. <br />The following logic applies to `initialVariantId`:<ul><li>If `initialVariantId` is provided, then it's used, even if it's out of stock.</li><li>If `initialVariantId` is provided, but is `null`, then no variant is used.</li><li>If nothing is passed to `initialVariantId`, and you're in a `ProductOptionsProvider` component, then `selectedVariant.id` is used.</li><li>If nothing is passed to `initialVariantId` and you're not in a `ProductOptionsProvider` component, then the first available or in-stock variant is used.</li><li>If nothing is passed to `initialVariantId`, you're not in a `ProductOptionsProvider` component, and no variants are in stock, then the first variant is used.</li></ul> |

## Component type

The `ProductOptionsProvider` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Related components

- [`ProductPrice`](/components/product-variant/productprice/)

## Related hooks

- [`useProductOptions`](/hooks/product-variant/useproductoptions/)
