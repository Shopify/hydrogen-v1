---
gid: ec1dd90e-87b0-4bd7-88ed-74d71a52cca5
title: Router
description: The Router component provides the context for routing in your Hydrogen storefront.
---

The `Router` component provides the context for routing in your Hydrogen storefront.

## Example code

{% codeblock file, filename: 'App.server.jsx' %}

```jsx
import {Router, FileRoutes, Route} from '@shopify/hydrogen';
function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ShopifyProvider>
        <CartProvider>
          <Router>
            <FileRoutes basePath="/es/" routes={esRoutes} />
            <FileRoutes basePath="/en/" routes={enRoutes} />
            <Route path="*" page={<NotFound />} />
          </Router>
        </CartProvider>
      </ShopifyProvider>
    </Suspense>
  );
}
function NotFound() {
  return <h1>Not found</h1>;
}
```

{% endcodeblock %}

## Props

| Name     | Type                                                         | Description         |
| -------- | ------------------------------------------------------------ | ------------------- |
| children | <code>Array&#60;ReactElement&#62; &#124; ReactElement</code> | Any React elements. |

## Component type

The `Router` component is a server component that renders inside `App.server.jsx`. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Considerations

- You should only have one `Router` component in your app.
- All [`FileRoutes`](https://shopify.dev/api/hydrogen/components/framework/fileroutes) and [`Route`](https://shopify.dev/api/hydrogen/components/framework/route) components must be children of `Router`.

## Related components

- [`FileRoutes`](https://shopify.dev/api/hydrogen/components/framework/fileroutes)
- [`Route`](https://shopify.dev/api/hydrogen/components/framework/route)

## Related framework topics

- [Routes](https://shopify.dev/custom-storefronts/hydrogen/framework/routes)
