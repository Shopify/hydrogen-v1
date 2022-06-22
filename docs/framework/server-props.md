---
gid: 4eae60cf-7fcb-45a4-9875-bb32245cee83
title: Server props
description: Learn how to manage your server props during your development process.
---

As you build your Hydrogen app with [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components), you might need to update `props` on the server. Sharing data between the client and server is important for common tasks, such as [page routing](https://shopify.dev/custom-storefronts/hydrogen/framework/routes).

This guide describes how to manage server props during your development process.

## How server props work

Server `props` are props that are passed to your root server component route. Hydrogen provides a [`useServerProps`](https://shopify.dev/api/hydrogen/hooks/global/useserverprops) hook with a `setServerProps` helper function, which allows you to re-render the server component with new `props`. This is useful to paginate within collections, switch product variants, or do anything that requires new data from the server.

For example, you can use geolocation co-ordinates as server props to provide a new hydrated experience for the current location:

{% codeblock file, filename: 'GeoLocate.client.jsx' %}

```js
navigator.geolocation.getCurrentPosition((data) => {
  setServerProps('geoCoordinates', data);
});
```

{% endcodeblock %}

Whenever you modify the props with `setServerProps()`, Hydrogen automatically makes a hydration request to the server component. Your app tree is updated based on the result of that hydration request.

## Example

The following example shows a page that queries a specific product ID based on server props:

{% codeblock file, filename: 'MyPage.server.jsx' %}

```jsx
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

{% endcodeblock %}

{% codeblock file, filename: 'ProductSelector.client.jsx' %}

```jsx
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

{% endcodeblock %}

When the user navigates to a new page in your app, the server props will reset. This is important because if the user navigates to another product, then the selected variant of the previous product shouldn't apply to the new product page.

## Related hooks

- [`useServerProps`](https://shopify.dev/api/hydrogen/hooks/global/useserverprops)

## Next steps

- Learn about [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components), an opinionated data-fetching and rendering workflow for React apps.
- Learn how to [work with React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/work-with-rsc).
