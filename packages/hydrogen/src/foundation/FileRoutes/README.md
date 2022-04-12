<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/Image and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/reference-docs/hydrogen.md. -->

The `FileRoutes` component builds a set of default Hydrogen routes based on the output provided by Vite's [import.meta.globEager](https://vitejs.dev/guide/features.html#glob-import) method. You can have multiple instances of this component to source file routes from multiple locations.

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
            <FileRoutes basePath="/es/" />
            <FileRoutes basePath="/en/" />
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

| Name       | Type                               | Description                                                                                                                                                                            |
| ---------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| routes?    | <code>ImportGlobEagerOutput</code> | The routes defined by Vite's [import.meta.globEager](https://vitejs.dev/guide/features.html#glob-import) method.                                                                       |
| basePath?  | <code>string</code>                | A path that's prepended to all file routes. You can modify `basePath` if you want to prefix all file routes. For example, you can prefix all file routes with a locale.                |
| dirPrefix? | <code>string &#124; RegExp</code>  | The portion of the file route path that shouldn't be a part of the URL. You need to modify this if you want to import your routes from a location other than the default `src/routes`. |

## Component type

The `FileRoutes` component is a server component that renders inside `App.server.jsx`. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`Router`](/api/hydrogen/components/framework/router)
- [`Route`](/api/hydrogen/components/framework/route)
