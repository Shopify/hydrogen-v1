---
'create-hydrogen-app': minor
'@shopify/hydrogen': minor
---

## New `<Route>` Component

The `<Route>` component is available for routes not defined by the file system. The `<Route>` component must be used within the `<Router>` component.

```jsx
// app.server.jsx

function App({routes, ...serverProps}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ShopifyProvider shopifyConfig={shopifyConfig}>
        <CartProvider>
          <DefaultSeo />
          <Router serverProps={serverProps}>
            <Route path="/custom" page={<CustomRoute />} />
          </Router>
        </CartProvider>
      </ShopifyProvider>
    </Suspense>
  );
}

function CustomRoute() {
  return <h1>Custom route</h1>;
}
```

`<Route>` accepts two props:

| Property | Type                                    | Required | Description                                                                                            |
| -------- | --------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `path`   | `string`                                | Yes      | The URL path where the route exists. The path can contain variables. For example, `/products/:handle`. |
| `page`   | `A rendered Server Component reference` | Yes      | A reference to a React Server Component that's rendered when the route is active.                      |

## Changes to `<Router>`

You can have multiple `<Route>` and `<FileRoutes>` components in your app. Hydrogen will only render one route for each request — whichever it finds first. This means the `<Router>` component no longer takes `fallback` as a prop. It also doesn't need `serverProps`. Instead, to render a 404 "Not Found" page, add `<Route path="*" page={<NotFound />} />` to your app. Make sure it's the last `<Route>` defined inside your app:

```diff
function App({routes, ...serverProps}) {
  return (
    <ShopifyProvider shopifyConfig={shopifyConfig}>
      <CartProvider>
        <DefaultSeo />
-       <Router
-         fallback={<NotFound response={serverProps.response} />}
-         serverProps={serverProps}
-       >
+       <Router>
          <FileRoutes routes={routes} />
+         <Route path="*" page={<NotFound />} />
        </Router>
      </CartProvider>
    </ShopifyProvider>
  );
}
```

## Changes to `<FileRoutes>`

The `<FileRoutes>` component now accepts two additional optional props:

| Property    | Type     | Required | Default Value | Description                                                             |
| ----------- | -------- | -------- | ------------- | ----------------------------------------------------------------------- |
| `basePath`  | `string` | No       | `"/"`         | A path that's prepended to all file routes.                             |
| `dirPrefix` | `string` | No       | `"./routes"`  | The portion of the file route path that shouldn't be a part of the URL. |

You need to modify `dirPrefix` if you want to import routes from a location other than `src/routes`.

You can modify `basePath` if you want to prefix all file routes. For example, you can prefix all file routes with a locale:

```jsx
<Router>
  <FileRoutes basePath={`/${locale}`} routes={routes} />
  <Route path="*" page={<NotFound />} />
</Router>
```

## New `useParams()` hook

You can use the `useParams()` hook to retrieve the parameters of an active route. The hook is available in both server and client components:

```jsx
// products/[handle].server.jsx

import {useParams} from '@shopify/hydrogen';

export default function Product() {
  const {handle} = useParams();
  // ...
}
```

```jsx
// ProductDetails.client.jsx
import {useParams} from '@shopify/hydrogen/client';

export default function ProductDetails() {
  const {handle} = useParams();
  // ...
}
```
