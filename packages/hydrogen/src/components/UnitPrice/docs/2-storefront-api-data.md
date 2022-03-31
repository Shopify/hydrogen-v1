## Storefront API data

The `data` prop is an object with fields that correspond to the Storefront API's [MoneyV2 object](/api/storefront/reference/common-objects/moneyv2):

```graphql
{
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
