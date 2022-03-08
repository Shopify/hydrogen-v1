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

| Property | Type                                    | Required | Description                                                                  |
| -------- | --------------------------------------- | -------- | ---------------------------------------------------------------------------- |
| `path`   | `string`                                | Yes      | The URL path the route exists at. Can contain variables: `/products/:handle` |
| `page`   | `A rendered Server Component reference` | Yes      | The component that will render for the route.                                |

## Changes to `<Router>`

You have both many `<Route>` components and multiple `<FileRoutes>` within your app. Hydrogen will only render one route for each request. Whichever it finds first. This means the `<Router>` component no longer takes `fallback` as a prop. Instead, to render a 404 not found page, just add `<Route path="*" page={<NotFound />} />` to your app. Just make sure it's the last `<Route>` defined inside your app:

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
+       <Router serverProps={serverProps}>
          <FileRoutes routes={routes} />
+         <Route path="*" page={<NotFound />} />
        </Router>
      </CartProvider>
    </ShopifyProvider>
  );
}
```

## Changes to `<FileRoutes>`

`<FileRoutes>` now accepts two additional optional props:

| Property    | Type     | Required | Default Value | Description                                                            |
| ----------- | -------- | -------- | ------------- | ---------------------------------------------------------------------- |
| `basePath`  | `string` | No       | `"/"`         | Path prepended to all file routes                                      |
| `dirPrefix` | `string` | No       | `"./routes"`  | The portion of the file route path that shouldn't be a part of the URL |

Changing the `dirPrefix` is necessary if you choose to import your routes from a location other than `src/routes`.

Changing `basePath` could be useful if you want to prefix all file routes, for example with a locale:

```jsx
<Router>
  <FileRoutes basePath={`/${locale}`} routes={routes} />
  <Route path="*" page={<NotFound />} />
</Router>
```
