---
'@shopify/hydrogen': minor
---

Add `useCustomer` hook to easily access the customer access token within the current session. This hook is only available within server components. There is also a new `customerAccessToken` prop available to the `CartProvider`. Use prop to associate a cart with the logged in user. Example:

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
