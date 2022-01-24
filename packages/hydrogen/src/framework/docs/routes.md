The Hydrogen framework uses a file-based routing system. This guide provides an introduction to how routing works in your Hydrogen app.

## How routes work

All components added to `src/pages` directory are registered as routes in `App.server.jsx`. Any filenames with brackets like `[handle]` are converted to a route parameter called `:handle`.

### Example

You have following components in your `src/pages` directory:

{% codeblock file, filename: 'src/pages' %}

```
/pages/index.server.jsx
/pages/custom-page.server.jsx
/pages/products/[handle].server.jsx
```

{% endcodeblock %}

The routes are registered in `App.server.jsx` and Hydrogen converts `[handle]` to `:handle`:

{% codeblock file, filename: 'App.server.jsx' %}

```
/
/custom-page
/products/:handle
```

{% endcodeblock %}

The `handle` property is passed directly to the root server component `/pages/products/[handle].server.jsx`. :

{% codeblock file, filename: '[handle].server.jsx' %}

```jsx
export default function Product({params}) {
  const {handle} = params;
  return <div>{handle}</div>;
}
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

{% codeblock file, filename: '[...handle].server.jsx' %}

```jsx
export default function({request}) {
  const { pathname } = new URL(request.url);)
}
```

{% endcodeblock %}

## API routes

API routes allow you to build your API in Hydrogen. Any server component within the `src/pages` directory that exports an API function will become an API route. The following examples show some common use cases for implementing API routes.

### Examples

The following example shows a "Hello world" implementation of an API route:

{% codeblock file, filename: "Hello world example" %}

```jsx
export function api(request, {params}) {
  return new Response('Hello world!');
}
```

{% endcodeblock %}

The following example shows an API route that returns a JSON response:

{% codeblock file, filename: "Return a JSON response" %}

```jsx
export function api(request, {params}) {
  return new Response(JSON.stringify({data: 1}), {
    headers: {'Content-Type': 'application/json'},
  });
}
```

{% endcodeblock %}

The following example shows how to set up a URL redirect with a status code of `301`:

{% codeblock file, filename: "Set up a URL redirect" %}

```jsx
export function api(request, {params}) {
  return new Response(null, {
    status: 301,
    headers: {Location: 'https://shopify.dev/custom-storefronts/hydrogen'},
  });
}
```

{% endcodeblock %}

The following example shows how to switch the HTTP method for the action performed by an API:

{% codeblock file, filename: "Switch the HTTP method" %}

```jsx
export async function api(request, {params}) {
  switch (request.method) {
    case 'GET':
      return new Response('GET');
    case 'POST':
      return new Response('POST');
  }
}
```

{% endcodeblock %}

The following example shows how to use API routes to read a request body:

{% codeblock file, filename: "Read a request body" %}

```jsx
export async function api(request, {params}) {
  if (request.method === 'PUT') {
    const json = await request.json();
    await saveToDatabase(params.handle, json);
    return new Response('success');
  }

  return new Response(null, {status: 405, headers: {Allow: 'PUT'}});
}
```

{% endcodeblock %}

### Changes for existing Hydrogen apps

If you created a Hydrogen app before January 19, 2022, and you want to implement an API route, then you need to make the following changes:

1. Move `const pages = import.meta.globEager('./pages/**/*.server.[jt](s|sx)');` from `App.server.jsx` to `entry-server.jsx`.
2. Pass the `pages` constant to the `renderHydrogen` component.
3. Make sure that `App.server.jsx` receives `pages` as a prop.

> Note:
> All Hydrogen apps created after January 19, 2022 automatically include these changes.

Your `App.server.jsx` and `entry-server.jsx` files should look similar to the following:

{% codeblock file, filename: 'entry-server.jsx' %}

```jsx
import renderHydrogen from '@shopify/hydrogen/entry-server';
import shopifyConfig from '../shopify.config';

import App from './App.server';

const pages = import.meta.globEager('./pages/**/*.server.[jt](s|sx)');

export default renderHydrogen(App, {shopifyConfig, pages});
```

{% endcodeblock %}

{% codeblock file, filename: 'App.server.jsx' %}

```jsx
import {DefaultRoutes} from '@shopify/hydrogen';
import {Suspense} from 'react';

import DefaultSeo from './components/DefaultSeo.server';
import NotFound from './components/NotFound.server';
import AppClient from './App.client';
import LoadingFallback from './components/LoadingFallback';

export default function App({log, pages, ...serverState}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AppClient helmetContext={serverState.helmetContext}>
        <DefaultSeo />
        <DefaultRoutes
          pages={pages}
          serverState={serverState}
          log={log}
          fallback={<NotFound />}
        />
      </AppClient>
    </Suspense>
  );
}
```

{% endcodeblock %}

## Next steps

- Learn about [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components), an opinionated data-fetching and rendering workflow for React apps.
- Learn how the [page server component](/custom-storefronts/hydrogen/framework/pages) receives props, which includes custom versions of `request` and `response`.
