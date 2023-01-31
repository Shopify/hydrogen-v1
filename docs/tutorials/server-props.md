---
gid: 4eae60cf-7fcb-45a4-9875-bb32245cee83
title: Server props
description: Learn how to manage your server props during your development process.
---

> ⚠️ **Important:** [Hydrogen 2.0](https://hydrogen.shopify.dev) is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please migrate to Hydrogen 2.0 as soon as possible.


As you build your Hydrogen app with [React Server Components](/docs/tutorials/react-server-components), you might need to update `props` on the server. Sharing data between the client and server is important for common tasks, such as [page routing](/docs/tutorials/routing).

This guide describes how to manage server props during your development process.

## How server props work

Server `props` are props that are passed to your root server component route. Hydrogen provides a [`useServerProps`](/docs/hooks/global/useserverprops) hook with a `setServerProps` helper function, which allows you to re-render the server component with new `props`. This is useful to paginate within collections, switch product variants, or do anything that requires new data from the server.

For example, you can use geolocation co-ordinates as server props to provide a new hydrated experience for the current location:

```js
// GeoLocate.client.jsx

navigator.geolocation.getCurrentPosition((data) => {
  setServerProps('geoCoordinates', data);
});
```



Whenever you modify the props with `setServerProps()`, Hydrogen automatically makes a hydration request to the server component. Your app tree is updated based on the result of that hydration request.

## Example

The following example shows a page that queries a specific product ID based on server props:

```jsx
// MyPage.server.jsx

export default function MyPage({selectedProductId}) {
  const {data} = useShopQuery({
    query: QUERY,
    variables: {productId: selectedProductId},
  });
  const {product} = data;

  return (
    <>
      <div>Selected product is {product.title}</div>
      <ProductSelector selectedProductId={selectedProductId} />
    </>
  );
}
```



```jsx
// ProductSelector.client.jsx

import {useServerProps} from '@shopify/hydrogen';

export default function ProductSelector({selectedProductId}) {
  const {setServerProps, pending} = useServerProps();

  return (
    <div>
      {pending ? <p>Loading...</p> : null}
      <button
        onClick={() => {
          setServerProps('selectedProductId', 123);
        }}
      >
        Select Shoes
      </button>
      <button
        onClick={() => {
          setServerProps('selectedProductId', 456);
        }}
      >
        Select Dresses
      </button>
    </div>
  );
}
```



When the user navigates to a new page in your app, the server props will reset. This is important because if the user navigates to another product, then the selected variant of the previous product shouldn't apply to the new product page.

## Related hooks

- [`useServerProps`](/docs/hooks/global/useserverprops)

## Next steps

- Learn about [React Server Components](/docs/tutorials/react-server-components), an opinionated data-fetching and rendering workflow for React apps.
- Learn how to [work with React Server Components](/docs/tutorials/react-server-components/work-with-rsc).
