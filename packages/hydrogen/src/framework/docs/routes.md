The Hydrogen framework uses a file-based routing system. This guide provides an introduction to how routing works in your Hydrogen app.

## How routes work

All components added to `src/pages` directory are registered as routes in `App.server.jsx`. Any filenames with brackets like `[handle]` are converted to a React Router parameter called `:handle`.

### Example

You have following components in your `src/pages` directory:

{% codeblock file, filename: 'src/pages' %}

```
/pages/index.server.jsx
/pages/custom-page.server.jsx
/pages/products/[handle].server.jsx
```

{% endcodeblock %}

The routes are registered in `App.server.jsx` and React Router converts `[handle]` to `:handle`:

{% codeblock file, filename: 'App.server.jsx' %}

```
/
/custom-page
/products/:handle
```

{% endcodeblock %}

To obtain the `handle` from React Router, add the following code to `App.server.jsx`:

{% codeblock file, filename: 'App.server.jsx' %}

```jsx
import {useParams} from 'react-router-dom';

const {handle} = useParams();
```

{% endcodeblock %}

### Custom static implementation

You can also provide a custom static implementation of a dynamic page to override the default. Any requests to `/products/hoodie` are rendered using `hoodie.server.jsx` instead of `[handle].server.jsx`:

{% codeblock file, filename: 'src/pages' %}

```
/pages/products/hoodie.server.jsx
/pages/products/[handle].server.jsx
```

{% endcodeblock %}

## Catch all routes

You can extend dynamic routes to catch all paths by adding an ellipsis (...) inside the brackets. For example, `/pages/example/[...handle].server.jsx` will match `/example/a` and `/example/a/b`.

### Example

The following example shows how to obtain catch all routes data using `location.pathname`:

{% codeblock file, filename: 'App.server.jsx' %}

```jsx
import {useLocation} from 'react-router-dom';

const {pathname} = useLocation();
```

{% endcodeblock %}

## API routes

As of January 19, 2022, any server component within the `src/pages` directory that exports an API function will become an API route. If you created a Hydrogen app before January 19, 2022, and you want to implement an API route, then you need to make the following changes:

1. Move `const pages = import.meta.globEager('./pages/**/*.server.[jt](s|sx)');` from `App.server.jsx` to `entry-server.jsx`.
2. Pass the `pages` constant to the `renderHydrogen` component.
3. Make sure that `App.server.jsx` receives `pages` as a prop.

Your `App.server.jsx` and `entry-server.jsx` files should look similar to the following:

{% codeblock file, filename: 'entry-server.jsx' %}

```jsx
import renderHydrogen from '@shopify/hydrogen/entry-server';

import App from './App.server';

const pages = import.meta.globEager('./pages/**/*.server.[jt](s|sx)');

export default renderHydrogen(App, {pages}, () => {
  // Custom hook
});
```

{% endcodeblock %}

{% codeblock file, filename: 'App.server.jsx' %}

```jsx
import {ShopifyServerProvider, DefaultRoutes} from '@shopify/hydrogen';
import {Switch} from 'react-router-dom';
import {Suspense} from 'react';

import shopifyConfig from '../shopify.config';

import DefaultSeo from './components/DefaultSeo.server';
import NotFound from './components/NotFound.server';
import CartProvider from './components/CartProvider.client';
import LoadingFallback from './components/LoadingFallback';

export default function App({log, pages, ...serverState}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ShopifyServerProvider shopifyConfig={shopifyConfig} {...serverState}>
        <CartProvider>
          <DefaultSeo />
          <Switch>
            <DefaultRoutes
              pages={pages}
              serverState={serverState}
              log={log}
              fallback={<NotFound />}
            />
          </Switch>
        </CartProvider>
      </ShopifyServerProvider>
    </Suspense>
  );
}
```

{% endcodeblock %}

## Next steps

- Learn about [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components), an opinionated data-fetching and rendering workflow for React apps.
- Learn how the [page server component](/custom-storefronts/hydrogen/framework/pages) receives props, which includes custom versions of `request` and `response`.
