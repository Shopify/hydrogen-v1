---
gid: f51e68fc-fafd-11eb-9a03-0242ac130003
title: CartProvider
description: The CartProvider component creates a context for using a cart.
---

The `CartProvider` component creates a context for using a cart. It creates a cart object and callbacks
that can be accessed by any descendent component using the `useCart` hook and related hooks. It also carries out
any callback props when a relevant action is performed. For example, if a `onLineAdd` callback is provided,
then the callback will be called when a new line item is successfully added to the cart.

The `CartProvider` component must be a descendent of the `ShopifyProvider` component.
You must use this component if you want to use the `useCart` hook or related hooks, or if you would like to use the `AddToCartButton` component.

## Example code

```tsx
import {CartProvider} from '@shopify/hydrogen';

export function App() {
  return <CartProvider>{/* Your JSX */}</CartProvider>;
}
```

## Props

| Name                   | Type                         | Description                                                                                                                                            |
| ---------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| children               | <code>React.ReactNode</code> | Any `ReactNode` elements.                                                                                                                              |
| data?                  | <code>Cart</code>            | An object with fields that correspond to the Storefront API's [Cart object](https://shopify.dev/api/storefront/latest/objects/cart).                   |
| numCartLines?          | <code>number</code>          | A callback that is invoked when the process to create a cart begins, but before the cart is created in the Storefront API.                             |
| onCreate?              | <code>() => void</code>      | A callback that is invoked when the process to create a cart begins, but before the cart is created in the Storefront API.                             |
| onLineAdd?             | <code>() => void</code>      | A callback that is invoked when the process to add a line item to the cart begins, but before the line item is added to the Storefront API.            |
| onLineRemove?          | <code>() => void</code>      | A callback that is invoked when the process to remove a line item to the cart begins, but before the line item is removed from the Storefront API.     |
| onLineUpdate?          | <code>() => void</code>      | A callback that is invoked when the process to update a line item in the cart begins, but before the line item is updated in the Storefront API.       |
| onNoteUpdate?          | <code>() => void</code>      | A callback that is invoked when the process to add or update a note in the cart begins, but before the note is added or updated in the Storefront API. |
| onBuyerIdentityUpdate? | <code>() => void</code>      | A callback that is invoked when the process to update the buyer identity begins, but before the buyer identity is updated in the Storefront API.       |
| onAttributesUpdate?    | <code>() => void</code>      | A callback that is invoked when the process to update the cart attributes begins, but before the attributes are updated in the Storefront API.         |
| onDiscountCodesUpdate? | <code>() => void</code>      | A callback that is invoked when the process to update the cart discount codes begins, but before the discount codes are updated in the Storefront API. |

## Component type

The `CartProvider` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Storefront API data

The `data` prop is an object with fields that correspond to the Storefront API's [Cart object](https://shopify.dev/api/storefront/latest/objects/cart):

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
              id
              handle
              title
              vendor
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

- [`AddToCartButton`](https://shopify.dev/api/hydrogen/components/cart/addtocartbutton)
- [`CartCheckoutButton`](https://shopify.dev/api/hydrogen/components/cart/cartcheckoutbutton)

## Related hooks

- [`useCart`](https://shopify.dev/api/hydrogen/hooks/cart/usecart)
