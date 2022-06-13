---
gid: 30ba6db5-9196-467b-b9c6-994ca42c45ad
title: Working with React Server Components
description: Learn how to work with React Server Components in your Hydrogen app.
---

This guide provides information about working with React Server Components in your Hydrogen app. To learn how React Server Components work in the context of Hydrogen, refer to [React Server Components overview](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

> Note:
> React Server Components are currently in Alpha. However, Hydrogen includes a built-in layer of abstraction that provides stability, regardless of the state of React Server Components.

## Fetching data on the server

All data fetching happens on the server and is never exposed to the client, unless you explicitly fetch data in a client component.

Hydrogen provides the following ways to fetch data from server components:

- [`useShopQuery`](https://shopify.dev/api/hydrogen/hooks/global/useshopquery): A hook that makes server-only GraphQL queries to the Storefront API.
- [`fetchSync`](https://shopify.dev/api/hydrogen/hooks/global/fetchsync): A hook that makes API requests and is the recommended way to make simple fetch calls on the server and the client.
- [`useQuery`](https://shopify.dev/api/hydrogen/hooks/global/usequery): A hook that executes an asynchronous operation like `fetch` in a way that supports [Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html). You can use this function to call any third-party APIs or perform any async tasks.

To learn how to fetch data from third-party sources, refer to [Data sources](https://shopify.dev/custom-storefronts/hydrogen/data-sources).

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

## Fetching data on the client

To make a third-party HTTP request on the client, use the [`fetchSync`](https://shopify.dev/api/hydrogen/hooks/global/fetchsync) hook within a Suspense boundary:

{% codeblock file, filename: 'PostDetails.client.jsx' %}

```js
import {fetchSync} from '@shopify/hydrogen';
import {Suspense, useState} from 'react';
export default function PostDetails() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)} type="button">
        Show Details
      </button>
      {show && (
        <Suspense fallback="Loading">
          <Details>
        </Suspense>
      }
    </>
  );
}
function Details() {
  const post = fetchSync('https://3p.api.com/post.json').json();
  return <h2>{post.title}</h2>;
}
```

{% endcodeblock %}

Some third-party integrations offer a JavaScript SDK in the form of an `npm` package. You can use Hydrogen's `suspendFunction` utility to create a version of the SDK which supports Suspense data-fetching:

{% codeblock file, filename: 'PostDetails.client.jsx' %}

```js
import {suspendFunction} from '@shopify/hydrogen';
import {Suspense, useState} from 'react';
import thirdPartyClient from 'third-party';
export default function PostDetails() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)} type="button">
        Show Details
      </button>
      {show && (
        <Suspense fallback="Loading">
          <Details>
        </Suspense>
      }
    </>
  );
}
function fetchThirdParty(opts) {
  return suspendFunction(['unique', 'key'], async () => {
    return await thirdPartyClient.query(opts)
  });
}
function Details() {
  const post = fetchThirdParty('myPost');
  return <h2>{post.title}</h2>;
}
```

{% endcodeblock %}

## Sharing data between client and server

> Note:
> The functionality described in this section is unique to Hydrogen's React Server Components implementation.

Hydrogen provides a [`useServerProps()` hook with a `setServerProps()` helper function](https://shopify.dev/custom-storefronts/hydrogen/framework/server-props), which allows you to re-render server components with new data. You can use `setServerProps()` for UI states that shouldn't persist in the URL. Any data set with `setServerProps()` will be reset when the user navigates to a new page.

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

## Related hooks

- [`useShopQuery`](https://shopify.dev/api/hydrogen/hooks/global/useshopquery)
- [`fetchSync`](https://shopify.dev/api/hydrogen/hooks/global/fetchsync)
- [`useQuery`](https://shopify.dev/api/hydrogen/hooks/global/usequery)
- [`useServerProps`](https://shopify.dev/api/hydrogen/hooks/global/useserverprops)

## Next steps

- Improve your app's loading performance with [streaming SSR and Suspense](https://shopify.dev/custom-storefronts/hydrogen/framework/streaming-ssr).
- Learn about how Hydrogen consumes data from different [sources](https://shopify.dev/custom-storefronts/hydrogen/data-sources).
