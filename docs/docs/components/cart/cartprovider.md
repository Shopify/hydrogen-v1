# CartProvider


The `CartProvider` component creates a context for using a cart. It creates a cart object and callbacks
that any descendent component can access using the `useCart` hook and related hooks. `CartProvider` also carries out
any callback props when a relevant action is performed. For example, if an `onLineAdd` callback is provided,
then the callback is called when a new line item is successfully added to the cart.

The `CartProvider` component must be a descendent of the `ShopifyProvider` component.

You must use this component to use the following:

- The `useCart` hook or related hooks

- The `AddToCartButton` component

## Required access scopes

The `CartProvider` component requires the following Storefront API [access scopes](https://shopify.dev/api/usage/access-scopes#unauthenticated-access-scopes):

- `unauthenticated_read_customers`
- `unauthenticated_write_customers`

## Example code

```tsx
import {CartProvider} from '@shopify/hydrogen';

export function App() {
  return <CartProvider>{/* Your JSX */}</CartProvider>;
}
```

## Props

| Name                   | Type                         | Description                                                                                                                                                                                                              |
| ---------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| children               | `React.ReactNode` | Any `ReactNode` elements.                                                                                                                                                                                                |
| data?                  | `Cart`            | An object with fields that correspond to the Storefront API's [Cart object](https://shopify.dev/api/storefront/latest/objects/cart).                                                                                     |
| cartFragment           | `string`          | A [fragment](#cart-fragment) used to query the Storefront API's [Cart object](https://shopify.dev/api/storefront/latest/objects/cart) for all queries and mutations. A default value is used if no argument is provided. |
| numCartLines?          | `number`          | A callback that's invoked when the process to create a cart begins, but before the cart is created in the Storefront API.                                                                                               |
| onCreate?              | `() => void`      | A callback that's invoked when the process to create a cart begins, but before the cart is created in the Storefront API.                                                                                               |
| onLineAdd?             | `() => void`      | A callback that's invoked when the process to add a line item to the cart begins, but before the line item is added to the Storefront API.                                                                              |
| onLineRemove?          | `() => void`      | A callback that's invoked when the process to remove a line item to the cart begins, but before the line item is removed from the Storefront API.                                                                       |
| onLineUpdate?          | `() => void`      | A callback that's invoked when the process to update a line item in the cart begins, but before the line item is updated in the Storefront API.                                                                         |
| onNoteUpdate?          | `() => void`      | A callback that's invoked when the process to add or update a note in the cart begins, but before the note is added or updated in the Storefront API.                                                                   |
| onBuyerIdentityUpdate? | `() => void`      | A callback that's invoked when the process to update the buyer identity begins, but before the buyer identity is updated in the Storefront API.                                                                         |
| onAttributesUpdate?    | `() => void`      | A callback that's invoked when the process to update the cart attributes begins, but before the attributes are updated in the Storefront API.                                                                           |
| onDiscountCodesUpdate? | `() => void`      | A callback that's invoked when the process to update the cart discount codes begins, but before the discount codes are updated in the Storefront API.                                                                   |
| onCreateComplete? | `() => void` | A callback that's invoked when the process to create a cart completes successfully. |
| onLineAddComplete? | `() => void` | A callback that's invoked when the process to add a line item to the cart completes successfully. |
| onLineRemoveComplete? | `() => void` | A callback that's invoked when the process to remove a line item to the cart completes successfully. |
| onLineUpdateComplete? | `() => void` | A callback that's invoked when the process to update a line item in the cart completes successfully. |
| onNoteUpdateComplete? | `() => void` | A callback that's invoked when the process to add or update a note in the cart completes successfully. |
| onBuyerIdentityUpdateComplete? | `() => void` | A callback that's invoked when the process to update the buyer identity completes successfully. |
| onAttributesUpdateComplete? | `() => void` | A callback that's invoked when the process to update the cart attributes completes successfully. |
| onDiscountCodesUpdateComplete? | `() => void` | A callback that is invoked when the process to update the cart discount codes completes successfully. |
| customerAccessToken?   | `CartBuyerIdentityInput['customerAccessToken']`          | The token that identifies the user that's logged in. This is necessary to associate the cart to an authenticated user.                                                                                                   |
| countryCode?            | `CountryCode`          | The ISO country code for i18n.                                                                                                                                                                                     |

## Cart fragment

You can provide the `cartFragment` prop to `CartProvider` to customize the fields requested from the Storefront API's [Cart object](https://shopify.dev/api/storefront/latest/objects/cart) for every query and mutation made by `CartProvider`.

The fragment must use the name `CartFragment` because it's referenced that way in each of the queries and mutations. If you provide a custom `cartFragment`, then it must be a raw string. For GraphQL syntax highlighting, you should use the `gql` utility exported from `@shopify/hydrogen` instead of [`graphql-tag`](https://github.com/apollographql/graphql-tag) because the latter returns an `ASTNode` instead of a `string`.

If you don't provide a `cartFragment` argument, then the following default value is used:

```graphql
fragment CartFragment on Cart {
  id
  checkoutUrl
  totalQuantity
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
        cost {
          totalAmount {
            amount
            currencyCode
          }
          compareAtAmountPerQuantity {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            availableForSale
            compareAtPriceV2 {
              ...MoneyFragment
            }
            priceV2 {
              ...MoneyFragment
            }
            requiresShipping
            title
            image {
              ...ImageFragment
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
  cost {
    subtotalAmount {
      ...MoneyFragment
    }
    totalAmount {
      ...MoneyFragment
    }
    totalDutyAmount {
      ...MoneyFragment
    }
    totalTaxAmount {
      ...MoneyFragment
    }
  }
  note
  attributes {
    key
    value
  }
  discountCodes {
    code
  }
}

fragment MoneyFragment on MoneyV2 {
  currencyCode
  amount
}
fragment ImageFragment on Image {
  id
  url
  altText
  width
  height
}
```

## Component type

The `CartProvider` component is a client component, which means that it renders on the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Related components

- [`AddToCartButton`](/components/cart/addtocartbutton/)
- [`CartCheckoutButton`](/components/cart/cartcheckoutbutton/)

## Related hooks

- [`useCart`](/hooks/cart/usecart/)
