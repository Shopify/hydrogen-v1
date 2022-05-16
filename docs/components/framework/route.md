---
gid: d5a8c1e3-1b18-42d2-900d-aa2a2d067e7e
title: Route
description: The Route component is used to set up a route in Hydrogen that's independent of the file system.
---

The `Route` component is used to set up a route in Hydrogen that's independent of the file system. Routes are matched in the order that they're defined.

## Example code

{% codeblock file, filename: 'App.server.jsx' %}

```tsx
import {Router, Route} from '@shopify/hydrogen';
function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ShopifyProvider>
        <CartProvider>
          <Router>
            <Route path="/" page={<Home />} />
            <Route path="/products/:handle" page={<Product />} />
            <Route path="*" page={<NotFound />} />
          </Router>
        </CartProvider>
      </ShopifyProvider>
    </Suspense>
  );
}
function Products({params}) {
  return <h1>Product name: {params.handle}</h1>;
}
function Home() {
  return <h1>Home</h1>;
}
function NotFound() {
  return <h1>Not found</h1>;
}
export default renderHydrogen(App);
```

{% endcodeblock %}

## Props

| Name | Type           | Description                                                                                            |
| ---- | -------------- | ------------------------------------------------------------------------------------------------------ |
| path | `string`       | The URL path where the route exists. The path can contain variables. For example, `/products/:handle`. |
| page | `ReactElement` | A reference to a React Server Component that's rendered when the route is active.                      |

## Component type

The `Route` component is a server component that renders inside `App.server.jsx`. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Considerations

- Only one route renders at a time.
- Use `path="*"` with the last defined `<Route>` to implement a fallback mechanism on a "Not Found" page.
- Routes defined with the `Route` component can't be API routes.

## Related components

- [`FileRoutes`](https://shopify.dev/api/hydrogen/components/framework/fileroutes)
- [`Router`](https://shopify.dev/api/hydrogen/components/framework/router)

## Related framework topics

- [Routes](https://shopify.dev/custom-storefronts/hydrogen/framework/routes)
