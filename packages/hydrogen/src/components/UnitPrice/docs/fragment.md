## GraphQL fragment

The following fragment is available as a string for your GraphQL query using `UnitPriceFragment` from `@shopify/hydrogen/fragments`. Using this fragment ensures that you have all the data necessary for rendering the `UnitPrice` component.

```graphql
fragment UnitPriceFragment on ProductVariant {
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
}
```
