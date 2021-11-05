Hydrogen is modelled after [React Server Components](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html), an approach that offers an opinionated data-fetching and rendering workflow for React apps. React Server Components are rendered in the server-side to improve the performance of React apps by decreasing bundle size and performing queries on the server.

This guide provides information about rules for server and client components, working with React Server Components in your Hydrogen app, and known limitations.

## Rules for server and client components

> Tip:
> You don't need to memorize the rules referenced in this section to use React Server Components. Hydrogen has lint rules and error messages to help enforce the constraints on `.server.jsx` and `.client.jsx` files during the rendering process.

React Server Components have the following constraints on server and client components:

- Component filenames ending with `.client.jsx` render on the client.
- Component filenames ending with `.server.jsx` render on the server, and their dependencies aren't in the client bundle.
- Component filenames not ending in `.client.jsx` or `.server.jsx` render on both the server and the client.
- Client components can’t access server-only features, like the filesystem, and can only import other client components.
- Server components can’t access client-only features, like state.

Due to these constraints, there are [specific rules](https://github.com/josephsavona/rfcs/blob/server-components/text/0000-server-components.md#capabilities--constraints-of-server-and-client-components) you need to follow when building your Hydrogen app.

![A diagram that illustrates the rules that apply to server and client components](/assets/custom-storefronts/hydrogen/server-client-component-rules.png)

### Example

The following example shows a server component (`Product.server.jsx`) that uses the [`useShopQuery`](/api/hydrogen/hooks/global/useshopquery) hook to fetch data. The data is passed to a client component (`WishListButton.client.jsx`) that uses state:

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

### Sharing code between server and client

In addition to server-specific and client-specific components, you can also create components, hooks, and utilities that work on both the server and the client. This allows logic to be shared across environments, as long as the components, hooks, and utilities meet all the [constraints of both the server and client components](https://github.com/josephsavona/rfcs/blob/server-components/text/0000-server-components.md#sharing-code-between-server-and-client).

![A diagram that illustrates server-specific and client-specific components and hooks, and shared components and hooks between the client and server](/assets/custom-storefronts/hydrogen/hydrogen-shared-components.png)

Although shared components have the most restrictions, many components already obey these rules and can be used across the server and client without modification. For example, many components transform some props based on certain conditions, without using state or loading additional data. This is why shared components are the default and don’t have a special file extension.

### Using `Context` in React Server Components

> Note:
> This section is unique to Hydrogen's React Server Components implementation and is subject to change.

React developers commonly use [`Context`](https://reactjs.org/docs/context.html) to share state among many different components in a render tree, without having to drill props down to each individual component.

Since server components are rendered as plain markup on the server, passing context from the rendered server component to the client component is difficult. To cross the server-client boundary, Hydrogen provides a mechanism to support context on both the server and the client.

#### `Provider` components

Any client component with a name that ends in `Provider` receives special treatment during server-rendering and client hydration. This allows server components to share context during the server-side rendering and makes sure that the context is initialized as a client component on the client.

The following rules apply to `Provider` components:

- You can't fetch server-only data from within `Provider` components. Instead, fetch data within server components and pass the data as props to the `Provider`.
- You can pass props to the `Provider` from server components, but they must be JSON-serializable.
- You need to split `Context` and `Provider` into separate files due to the way that components are dynamically loaded on the client.

#### Example

The following example shows the implementation of a `Provider` component:

{% codeblock file, filename: 'CartContext.client.jsx' %}

```js
// Note: This must be a separate client component from your special Provider component.

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

## Working with React Server Components

The following section includes information about working with React Server Components in your Hydrogen app.

### Sharing `state` between client and server

The `state` object is core to React Server Components. Hydrogen provides a [`useServerState()` hook with a `setServerState()` helper function](/custom-storefronts/hydrogen/framework/server-state), which allows components to paginate within collections, programmatically switch routes, or do anything that requires new data from the server.

Sharing state information between the client and server is important for common tasks, like `page` routing. The following diagram shows how the `page` state is shared between the client and server:

![A diagram that illustrates the workflow for sharing state information between client and server](/assets/custom-storefronts/hydrogen/hydrogen-sharing-state-information.png)

1. `App.server.jsx` relies on the `page` state to choose the correct route to render. To change routes, the client updates the `page` state:

   {% codeblock file, filename: 'ProductDetails.client.jsx' %}

   ```js
   useEffect(() => {
     setServerState('pathname', location.pathname);
   }, [location.pathname, setServerState]);
   ```

   {% endcodeblock %}

2. The `page` state is sent to the server. This happens through a `useServerResponse` fetch call. It's a special server endpoint called `/react` which accepts `state` as a query parameter.
3. The `/react` endpoint returns the wire representation for the new state.
4. The state is partially hydrated (made interactive) and rendered into the DOM, similar to how the initial page was made interactive.

   Hydrogen uses `/react` for routing, but also for any other state that needs to be synced to the server.

### Fetching data on the server

All data fetching happens on the server and is never exposed to the client, unless you explicitly fetch data in a client component.

Hydrogen provides the following ways to fetch data from server components:

- [`useShopQuery`](/api/hydrogen/hooks/global/useshopquery): A hook that allows you to make server-only GraphQL queries to the Storefront API.
- [`useQuery`](/api/hydrogen/hooks/global/usequery):: A simple wrapper around `fetch` that supports [Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html). You can use this function to call any third-party APIs.

### Accessing Hydrogen components from client components

Because of the way tree-shaking works in Vite, avoid importing server components when referencing Hydrogen client components in one of your client components.

Hydrogen provides a special `@shopify/hydrogen/client` module to reference components that are safe to use within client components. You should use this import path when writing your client components.

## Known limitations

When you send props to client components from a server component, make sure that the props are JSON-serializable. For example, functions or callbacks can't be passed as props.

The following prop would send successfully:

{% codeblock file, filename: 'App.server.jsx' %}

```jsx
<MyClientComponent color="red" intro={<p>Here's my favorite color:</p>}>
  Great to have you here today.
</MyClientComponent>
```

{% endcodeblock %}

The following prop wouldn't send successfully:

{% codeblock file, filename: 'App.server.jsx' %}

```jsx
<MyClientComponent onClick={() => console.log('uh oh')}>
  Great to have you here today.
</MyClientComponent>
```

{% endcodeblock %}

## Next steps

- Learn how to manage the [state on the server](/custom-storefronts/hydrogen/framework/server-state) as you're building your Hydrogen app.
- Get familiar with the [file-based routing system](/custom-storefronts/hydrogen/framework/routes) that Hydrogen uses.
- Learn how the [page server component](/custom-storefronts/hydrogen/framework/pages) receives props, which includes custom versions of `request` and `response`.
