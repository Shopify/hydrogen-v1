<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/CartProvider and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

## Example code

```tsx
import {CartProvider} from '@shopify/hydrogen';

export function App() {
  return <CartProvider>{/* Your JSX */}</CartProvider>;
}
```

## Props

| Name                   | Type                                  | Description                                                                                                                                            |
| ---------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| children               | <code>React.ReactNode</code>          | Any `ReactNode` elements.                                                                                                                              |
| data?                  | [GraphQL query](#storefront-api-data) | A cart object from the Storefront API to populate the initial state of the provider.                                                                   |
| numCartLines?          | <code>number</code>                   | A callback that is invoked when the process to create a cart begins, but before the cart is created in the Storefront API.                             |
| onCreate?              | <code>() => void</code>               | A callback that is invoked when the process to create a cart begins, but before the cart is created in the Storefront API.                             |
| onLineAdd?             | <code>() => void</code>               | A callback that is invoked when the process to add a line item to the cart begins, but before the line item is added to the Storefront API.            |
| onLineRemove?          | <code>() => void</code>               | A callback that is invoked when the process to remove a line item to the cart begins, but before the line item is removed from the Storefront API.     |
| onLineUpdate?          | <code>() => void</code>               | A callback that is invoked when the process to update a line item in the cart begins, but before the line item is updated in the Storefront API.       |
| onNoteUpdate?          | <code>() => void</code>               | A callback that is invoked when the process to add or update a note in the cart begins, but before the note is added or updated in the Storefront API. |
| onBuyerIdentityUpdate? | <code>() => void</code>               | A callback that is invoked when the process to update the buyer identity begins, but before the buyer identity is updated in the Storefront API.       |
| onAttributesUpdate?    | <code>() => void</code>               | A callback that is invoked when the process to update the cart attributes begins, but before the attributes are updated in the Storefront API.         |
| onDiscountCodesUpdate? | <code>() => void</code>               | A callback that is invoked when the process to update the cart discount codes begins, but before the discount codes are updated in the Storefront API. |

## Component type

The `CartProvider` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

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

## Related components

- [`AddToCartButton`](/api/hydrogen/components/cart/addtocartbutton)
- [`CartCheckoutButton`](/api/hydrogen/components/cart/cartcheckoutbutton)

## Related hooks

- [`useCart`](/api/hydrogen/hooks/cart/usecart)
