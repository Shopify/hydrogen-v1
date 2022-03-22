This guide provides information about working with React Server Components in your Hydrogen app. To learn how React Server Components work in the context of Hydrogen, refer to [React Server Components overview](/custom-storefronts/hydrogen/framework/react-server-components).

> Note:
> React Server Components are currently in Alpha. However, Hydrogen includes a built-in layer of abstraction that provides stability, regardless of the state of React Server Components.

## Fetching data on the server

All data fetching happens on the server and is never exposed to the client, unless you explicitly fetch data in a client component.

Hydrogen provides the following ways to fetch data from server components:

- [`useShopQuery`](/api/hydrogen/hooks/global/useshopquery): A hook that allows you to make server-only GraphQL queries to the Storefront API.
- [`useQuery`](/api/hydrogen/hooks/global/usequery): A simple wrapper around `fetch` that supports [Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html). You can use this function to call any third-party APIs.

To learn how to fetch data from third-party sources, refer to [Data sources](/custom-storefronts/hydrogen/data-sources).

### Example

The following example shows a server component (`Product.server.jsx`) that uses the `useShopQuery` hook to fetch data. The data is passed to a client component (`WishListButton.client.jsx`) that uses state:

{% codeblock file, filename: 'Product.server.jsx' %}

```js
import {useShopQuery} from '@shopify/hydrogen';
import WishListButton from './WishListButton.client';

export default function Product() {
  const {data} = useShopQuery({query: QUERY});

  return (
    <section>
      <h1>{data.product.title}</h1>
      <WishListButton product={data.product} />
    </section>
  );
}
```

{% endcodeblock %}

{% codeblock file, filename: 'WishListButton.client.jsx' %}

```js
import {useState} from 'react';

export default function WishListButton({product}) {
  const [added, setAddToWishList] = useState(false);

  return (
    <button onClick={() => setAddToWishList(!added)} type="button">
      {added ? 'Added' : 'Add'} {product.title} to Wish List
    </button>
  );
}
```

{% endcodeblock %}

## Importing functionality in Hydrogen components

Hydrogen includes the following import locations:

- `@shopify/hydrogen`: An import path for functionality that's only used in server components. This doesn't include hooks that should only be used in client components.
- `@shopify/hydrogen/client`: An import path for functionality that's only used in client components. You should use this import path when writing your client components.

> Note:
> The path for importing functionality doesn't define the type of the component. The separate import paths are used for organizational purposes. The `@shopify/hydrogen/client` import path prevents server functionality from being used in the browser. However, the inverse isn't true for server components as they can import and use client components.

### Examples

The following example shows how to use the `@shopify/hydrogen` import path in a server component:

{% codeblock file, filename: 'NotFound.server.jsx' %}

```jsx
import {useShopQuery} from '@shopify/hydrogen';
```

{% endcodeblock %}

The following example shows how to use the `@shopify/hydrogen/client` import path in a client component:

{% codeblock file, filename: 'ProductSelector.client.jsx' %}

```jsx
import {useServerState} from '@shopify/hydrogen/client';
```

{% endcodeblock %}

The following example shows how to import the `Link` component into a client and server component:

{% codeblock file, filename: 'Button.client.jsx' %}

```jsx
import {Link} from '@shopify/hydrogen/client';
```

{% endcodeblock %}

{% codeblock file, filename: 'index.server.jsx' %}

```jsx
import {Link} from '@shopify/hydrogen';
```

{% endcodeblock %}

## Sharing `state` between client and server

> Note:
> The functionality described in this section is unique to Hydrogen's React Server Components implementation.

Hydrogen provides a [`useServerState()` hook with a `setServerState()` helper function](/custom-storefronts/hydrogen/framework/server-state), which allows components to paginate within collections, programmatically switch routes, or do anything that requires new data from the server.

Sharing state information between the client and server is important for common tasks, like `page` routing. The following diagram shows how the `page` state is shared between the client and server:

![A diagram that illustrates the workflow for sharing state information between client and server](/assets/custom-storefronts/hydrogen/hydrogen-sharing-state-information.png)

1. `App.server.jsx` relies on the `pathname` and `search` state to choose the correct route to render. To change routes, the client updates the `page` state:

   {% codeblock file, filename: 'ProductDetails.client.jsx' %}

   ```js
   useEffect(() => {
     setServerState({pathname: location.pathname, search: location.search});
   }, [location.pathname, location.search, setServerState]);
   ```

   {% endcodeblock %}

2. The `pathname` and `search` state is sent to the server. This happens through a `useServerResponse` fetch call. It's a special server endpoint called `/__rsc` which accepts `state` as a query parameter.
3. The `/__rsc` endpoint returns the wire representation for the new state.
4. The state is partially hydrated (made interactive) and rendered into the DOM, similar to how the initial page was made interactive.

   Hydrogen uses `/__rsc` for routing, but also for any other state that needs to be synced to the server.

## Using `Context` in React Server Components

React developers commonly use [`Context`](https://reactjs.org/docs/context.html) to share state among many different components in a render tree, without having to drill props down to each individual component.

Currently, you can't use `Context` inside server components because server context isn't yet available in React. However, you can use `Context` inside client components.

> Note:
> The `ShopifyProvider` component is a server component that renders inside `App.server.jsx`. `ShopifyProvider` is specific to Hydrogen and currently doesn't work in Next.js or other frameworks.

### Example

The following example shows how to use `Context` in the `CartProvider` client component:

{% codeblock file, filename: 'CartContext.client.jsx' %}

```js
const CartAppContext = createContext();

export default CartAppContext;

export function useCartContext() {
  const context = useContext(CartAppContext);

  if (!context) {
    throw new Error('No cart context found');
  }

  return context;
}
```

{% endcodeblock %}

{% codeblock file, filename: 'CartProvider.client.jsx' %}

```js
import {CartContext} from './CartContext.client';

export default function CartProvider({items, children}) {
  const value = {
    items,
    // ...
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
```

{% endcodeblock %}

{% codeblock file, filename: 'App.server.jsx' %}

```js
import CartProvider from './CartProvider.client';

export default function App() {
  const {data} = useShopQuery({query: QUERY});

  return (
    <CartProvider data={data.cart}>
      <p>Your app here</p>
    </CartProvider>
  );
}
```

{% endcodeblock %}

## Next steps

- Learn how to manage the [state on the server](/custom-storefronts/hydrogen/framework/server-state) as you're building your Hydrogen app.
- Get familiar with the [file-based routing system](/custom-storefronts/hydrogen/framework/routes) that Hydrogen uses.
- Learn how the [page server component](/custom-storefronts/hydrogen/framework/pages) receives props, which includes custom versions of `request` and `response`.
