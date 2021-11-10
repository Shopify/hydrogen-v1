This guide provides information about working with React Server Components in your Hydrogen app.

> Note:
> React Server Components are currently in Alpha. However, Hydrogen includes a built-in layer of abstraction that provides stability, regardless of the state of React Server Components.

## Fetching data on the server

All data fetching happens on the server and is never exposed to the client, unless you explicitly fetch data in a client component.

Hydrogen provides the following ways to fetch data from server components:

- [`useShopQuery`](/api/hydrogen/hooks/global/useshopquery): A hook that allows you to make server-only GraphQL queries to the Storefront API.
- [`useQuery`](/api/hydrogen/hooks/global/usequery): A simple wrapper around `fetch` that supports [Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html). You can use this function to call any third-party APIs.

## Accessing Hydrogen components from client components

Because of the way tree-shaking works in Vite, avoid importing server components when referencing Hydrogen client components in one of your client components.

Hydrogen provides a special `@shopify/hydrogen/client` module to reference components that are safe to use within client components. You should use this import path when writing your client components.

## Sharing `state` between client and server
> Note:
> The functionality described in this section is unique to Hydrogen's React Server Components implementation.

Hydrogen provides a [`useServerState()` hook with a `setServerState()` helper function](/api/hydrogen/framework/server-state), which allows components to paginate within collections, programmatically switch routes, or do anything that requires new data from the server.

Sharing state information between the client and server is important for common tasks, like `page` routing. The following diagram shows how the `page` state is shared between the client and server:

![A diagram that illustrates the workflow for sharing state information between client and server](/assets/custom-storefronts/hydrogen/hydrogen-sharing-state-information.png)

1. `App.server.jsx` relies on the `page` state to choose the correct route to render. To change routes, the client updates the `page` state:

    {% codeblock file, filename: 'ProductDetails.client.jsx' %}
    ```js
    useEffect(() => {
      setServerState('page', location.pathname);
    }, [location.pathname, setServerState]);
    ```
    {% endcodeblock %}

2. The `page` state is sent to the server. This happens through a `useServerResponse` fetch call. It's a special server endpoint called `/react` which accepts `state` as a query parameter.
3. The `/react` endpoint returns the wire representation for the new state.
4. The state is partially hydrated (made interactive) and rendered into the DOM, similar to how the initial page was made interactive.

    Hydrogen uses `/react` for routing, but also for any other state that needs to be synced to the server.

## Using `Context` in React Server Components

> Note:
> The functionality described in this section is unique to Hydrogen's React Server Components implementation and will change when server context is implemented upstream in React.

React developers commonly use [`Context`](https://reactjs.org/docs/context.html) to share state among many different components in a render tree, without having to drill props down to each individual component.

Server context support is [on the React team's roadmap](https://github.com/josephsavona/rfcs/blob/server-components/text/0000-server-components.md#how-do-you-do-routing), but it is not yet implemented. In order to share context between server components and client components, Hydrogen provides a workaround mechanism.

### `Provider` components

Any client component with a name that ends in `Provider` receives special treatment during server-rendering and client hydration. This allows server components to share context during the server-side rendering and makes sure that the context is initialized as a client component on the client.

### Rules

The following rules apply to `Provider` components:

- You can't fetch server-only data from within `Provider` components. Instead, fetch data within server components and pass the data as props to the `Provider`.
- You can pass props to the `Provider` from server components, but they must be JSON-serializable.
- You need to split `Context` and `Provider` into separate files due to the way that components are dynamically loaded on the client.

### Example

The following example shows the implementation of a `Provider` component:

{% codeblock file, filename: 'CartContext.client.jsx' %}
```js
// This must be a separate client component from your special `Provider` component.

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
    <CartProvider items={data.items}>
      <p>Your app here</p>
    </CartProvider>
  );
}
```
{% endcodeblock %}

## Next steps

- Learn how to manage the [state on the server](/api/hydrogen/framework/server-state) as you're building your Hydrogen app.
- Get familiar with the [file-based routing system](/api/hydrogen/framework/routes) that Hydrogen uses.
- Learn how the [page server component](/api/hydrogen/framework/pages) receives props, which includes custom versions of `request` and `response`.
