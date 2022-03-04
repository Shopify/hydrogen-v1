## GraphQL fragment

The following fragment is available as a string for your GraphQL query using `MoneyFragment` from `@shopify/hydrogen/fragments`. Using this fragment ensures that you have all the data necessary for rendering the `Money` component.

```graphql
fragment MoneyFragment on MoneyV2 {
  currencyCode
  amount
}
```
