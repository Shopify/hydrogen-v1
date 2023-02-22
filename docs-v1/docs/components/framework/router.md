# Router


The `Router` component provides the context for routing in your Hydrogen storefront.

## Example code

```jsx title="App.server.jsx"
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



## Props

| Name     | Type                                                         | Description         |
| -------- | ------------------------------------------------------------ | ------------------- |
| children | `Array&#60;ReactElement&#62; &#124; ReactElement` | Any React elements. |

## Component type

The `Router` component is a server component that renders inside `App.server.jsx`. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Considerations

- You should only have one `Router` component in your app.
- All [`FileRoutes`](/components/framework/fileroutes/) and [`Route`](/components/framework/route/) components must be children of `Router`.

## Related components

- [`FileRoutes`](/components/framework/fileroutes/)
- [`Route`](/components/framework/route/)

## Related framework topics

- [Routes](https://shopify.dev/custom-storefronts/hydrogen/routing)
