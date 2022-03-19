## Storefront API data

The following GraphQL query corresponds to the Storefront API's [ProductVariant object](/api/storefront/2022-01/objects/ProductVariant). Using the query ensures that you have all the data necessary for the `useProductOptions` hook:

```graphql
{
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
  sellingPlanAllocations(first: $numProductVariantSellingPlanAllocations) {
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
```

### Variables

The [Product object](/api/storefront/reference/products/product) includes variables that you will need to provide values for when performing your query.

| Variable                                   | Description                                                                                           |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `$numProductVariantMetafields`             | The number of `Metafield` objects to query for in a variant's `MetafieldConnection`.                  |
| `$numProductVariantSellingPlanAllocations` | The number of `SellingPlanAllocations` to query for in a variant's `SellingPlanAllocationConnection`. |
| `$numProductSellingPlanGroups`             | The number of `SellingPlanGroups` objects to query for in a `SellingPlanGroupConnection`.             |
| `$$numProductSellingPlans`                 | The number of `SellingPlan` objects to query for in a `SellingPlanConnection`.                        |
