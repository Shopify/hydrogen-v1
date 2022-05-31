---
gid: 182b039d-d09d-4513-8759-b51412cc8293
title: FileRoutes
description: The FileRoutes component builds a set of Hydrogen routes.
---

The `FileRoutes` component builds a set of Hydrogen routes. By default, it loads the routes specified in [the Hydrogen configuration file](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config) when no props are passed.

You can override the default behavior and use custom routes based on the output that's provided by Vite's [import.meta.globEager](https://vitejs.dev/guide/features.html#glob-import) method. You can have multiple instances of the `FileRoutes` component to source file routes from multiple locations.

## Example code

{% codeblock file, filename: 'App.server.jsx' %}

```jsx
import {Router, FileRoutes, Route} from '@shopify/hydrogen';

function App() {
  const esRoutes = import.meta.globEager('./custom-routes/es/**/*.server.jsx');
  const enRoutes = import.meta.globEager('./custom-routes/en/**/*.server.jsx');

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ShopifyProvider>
        <CartProvider>
          <Router>
            <FileRoutes />
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

| Name       | Type                               | Description                                                                                                                                                                            |
| ---------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| routes?    | <code>ImportGlobEagerOutput</code> | The routes defined by Vite's [import.meta.globEager](https://vitejs.dev/guide/features.html#glob-import) method.                                                                       |
| basePath?  | <code>string</code>                | A path that's prepended to all file routes. You can modify `basePath` if you want to prefix all file routes. For example, you can prefix all file routes with a locale.                |
| dirPrefix? | <code>string &#124; RegExp</code>  | The portion of the file route path that shouldn't be a part of the URL. You need to modify this if you want to import your routes from a location other than the default `src/routes`. |

## Component type

The `FileRoutes` component is a server component that renders inside `App.server.jsx`. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Related components

- [`Router`](https://shopify.dev/api/hydrogen/components/framework/router)
- [`Route`](https://shopify.dev/api/hydrogen/components/framework/route)

## Related framework topics

- [Routes](https://shopify.dev/custom-storefronts/hydrogen/framework/routes)
- [Hydrogen configuration](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config)
