## GraphQL fragment

The following GraphQL fragment is available for your queries as `VariantFragment`. Using this query ensures that you have all the data necessary for the `useProductOptions` hook.

```graphql
fragment VariantFragment on ProductVariant {
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
  ...UnitPriceFragment
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
        ...MetafieldFragment
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

The `ProductProviderFragment` includes variables that you will need to provide values for when performing your query.

| Variable                                   | Description                                                                                           |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `$numProductVariantMetafields`             | The number of `Metafield` objects to query for in a variant's `MetafieldConnection`.                  |
| `$numProductVariantSellingPlanAllocations` | The number of `SellingPlanAllocations` to query for in a variant's `SellingPlanAllocationConnection`. |
| `$numProductSellingPlanGroups`             | The number of `SellingPlanGroups` objects to query for in a `SellingPlanGroupConnection`.             |
| `$$numProductSellingPlans`                 | The number of `SellingPlan` objects to query for in a `SellingPlanConnection`.                        |
