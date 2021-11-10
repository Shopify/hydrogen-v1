<!-- This file is generated from the source code and any changes you make here will be overwritten. For more information, refer to https://github.com/Shopify/shopify-dev/blob/master/content/internal/operations/hydrogen-reference-docs.md. -->

As you build your Hydrogen app with [React Server Components](/api/hydrogen/framework/react-server-components), you'll likely need to update `state` on the server. Sharing state information between the client and server is important for common tasks, like [page routing](/api/hydrogen/framework/react-server-components#sharing-state-between-client-and-server).

This guide describes how to manage your server state during your development process.

## How `state` works

The `state` object is core to React Server Components. Hydrogen provides a `useServerState()` hook with a `setServerState()` helper function, which allows components to paginate within collections, programmatically switch routes, or do anything that requires new data from the server.

For example, you can take geo-location co-ordinates and set them as `serverState` to provide a new hydrated experience for the current location:

{% codeblock file, filename: 'GeoLocate.client.jsx' %}

```js
navigator.geolocation.getCurrentPosition((data) => {
  setServerState('geoCoordinates', data);
});
```

{% endcodeblock %}

## Managing server state

The most basic example of `state` is the `page` prop, which Hydrogen manages for you whenever your URL location changes. The server state is passed as a prop to page components. However, you can set any state that you want within client components using the [`useServerState`](/api/hydrogen/hooks/global/useserverstate) hook:

```js
import {useServerState} from '@shopify/hydrogen/client';

const {setServerState} = useServerState();
```

Whenever you modify the state with `setServerState()`, Hydrogen automatically makes a hydration request to the server component. Your app tree is updated based on the result of that hydration request.

## Example

The following example shows a page that queries a specific product ID based on server state:

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
import {useServerState} from '@shopify/hydrogen/client';

export default function ProductSelector({selectedProductId}) {
  const {setServerState} = useServerState();

  return (
    <div>
      <button
        onClick={() => {
          setServerState('selectedProductId', 123);
        }}
      >
        Select Shoes
      </button>
      <button
        onClick={() => {
          setServerState('selectedProductId', 456);
        }}
      >
        Select Dresses
      </button>
    </div>
  );
}
```

{% endcodeblock %}

## Next steps

- Learn about [React Server Components](/api/hydrogen/framework/react-server-components), an opinionated data-fetching and rendering workflow for React apps.
- Learn how to interact with the [`useServerState`](/api/hydrogen/hooks/global/useserverstate) hook.
- Learn how the [page server component](/api/hydrogen/framework/pages) receives props, which includes custom versions of `request` and `response`.
