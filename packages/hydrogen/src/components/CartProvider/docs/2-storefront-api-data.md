## Storefront API data

The `data` prop is an object with fields that correspond to the Storefront API's [Cart object](/api/storefront/latest/objects/cart):

```graphql
{
  id
  checkoutUrl
  buyerIdentity {
    countryCode
    customer {
      id
      email
      firstName
      lastName
      displayName
    }
    email
    phone
  }
  lines(first: $numCartLines) {
    edges {
      node {
        id
        quantity
        attributes {
          key
          value
        }
        merchandise {
          ... on ProductVariant {
            id
            availableForSale
            compareAtPriceV2 {
              currencyCode
              amount
            }
            priceV2 {
              currencyCode
              amount
            }
            requiresShipping
            title
            image {
              id
              url
              altText
              width
              height
            }
            product {
              handle
              title
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
  estimatedCost {
    subtotalAmount {
      currencyCode
      amount
    }
    totalAmount {
      currencyCode
      amount
    }
    totalDutyAmount {
      currencyCode
      amount
    }
    totalTaxAmount {
      currencyCode
      amount
    }
  }
  note
  attributes {
    key
    value
  }
  discountCodes {
    code
    applicable
  }
}
```
