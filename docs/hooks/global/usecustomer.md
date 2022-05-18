---
gid: 447feed0-0a99-42e2-8354-0df1ffb8808c
title: useCustomer
description: The `useCustomer` hook returns the customer access token of the currently logged in user.
---

The `useCustomer` hook returns the customer access token of the currently logged in user. If there is no logged in user, returns `undefined`. The access token can be passed as a prop to the [`CartProvider`](https://shopify.dev/api/hydrogen/components/cart/cartprovider). It should only be used within server components. 

## Example code

{% codeblock file, filename: "App.server.js" %}

```jsx
import {ShopifyProvider, CartProvider, useCustomer} from '@shopify/hydrogen';
import {Suspense} from 'react';

export function App() {
  const customerAccessToken = useCustomer();
  return (
    <Suspense fallback="Loading...">
      <ShopifyProvider>
        <CartProvider customerAccessToken={customerAccessToken}>
        ...
      </ShopifyProvider>
    </Suspense>
  );
}
```

{% endcodeblock %}

## Return value
Returns a string access token if there is an active session. Returns `undefined` if there is no active session.

## Related hooks

- [`useCart`](https://shopify.dev/api/hydrogen/hooks/cart/usecart)

## Related Components

- [CartProvider](https://shopify.dev/api/hydrogen/components/cart/cartprovider)
