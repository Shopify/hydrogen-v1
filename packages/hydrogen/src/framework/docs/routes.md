The Hydrogen framework uses a file-based routing system. This guide provides an introduction to how routing works in your Hydrogen app.

## How routes work

All components added to the `src/routes` directory are registered as routes in `App.server.jsx`. Any filenames with brackets, like `[handle]`, are converted to a route parameter called `:handle`.

You can navigate between routes using the [`Link`](/api/hydrogen/components/framework/link) component or the [`useNavigate`](/api/hydrogen/hooks/framework/usenavigate) hook. You can use the [`useRouteParams`](/api/hydrogen/hooks/framework/userouteparams) hook to retrieve the parameters of an active route.

### Example

You have following components in your `src/routes` directory:

{% codeblock file, filename: 'src/routes' %}

```
/routes/index.server.jsx
/routes/custom-page.server.jsx
/routes/products/[handle].server.jsx
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

The `handle` property is passed directly to the root server component `/routes/products/[handle].server.jsx`:

{% codeblock file, filename: '[handle].server.jsx' %}

```jsx
export default function Product() {
  const {handle} = useRouteParams();
  return <div>{handle}</div>;
}
```

{% endcodeblock %}

### Custom static implementation

You can also provide a custom static implementation of a dynamic page to override the default. Any requests to `/products/hoodie` are rendered using `hoodie.server.jsx` instead of `[handle].server.jsx`:

{% codeblock file, filename: 'src/routes' %}

```
/routes/products/hoodie.server.jsx
/routes/products/[handle].server.jsx
```

{% endcodeblock %}

### Prefetching a link source

The [`Link`](/api/hydrogen/components/framework/link) component includes an optional `prefetch` prop that controls whether to prefetch a link source when a user signals intent. The default value is `true`.

If you want to disable link prefetching, then pass `preload={false}` to the `Link` component:

{% codeblock file, filename: 'Component.client.jsx' %}

```html
<Link prefetch={false} to="/path">Link</Link>
```

{% endcodeblock %}

By default, when a user hovers or focuses on the link for more than 100ms, a prefetch link tag is rendered for the React Server Components response path. If the user prematurely leaves or blurs the link, then the prefetch link tag isn't added.

## Catch all routes

You can extend dynamic routes to catch all paths by adding an ellipsis (...) inside the brackets. For example, `/routes/example/[...handle].server.jsx` will match `/example/a` and `/example/a/b`.

### Example

The following example shows how to obtain catch all routes data using `location.pathname`:

{% codeblock file, filename: '[...handle].server.jsx' %}

```jsx
export default function({request}) {
  const { pathname } = new URL(request.url);)
}
```

{% endcodeblock %}

## Custom routes

By default, Hydrogen uses a file-based routing system, but you can customize routes in `App.server.jsx` using the following components:

- [`Router`](/api/hydrogen/components/framework/router): Provides the context for routing in your Hydrogen app
- [`FileRoutes`](/api/hydrogen/components/framework/fileroutes): Builds a set of default Hydrogen routes based on the output provided by Vite's [import.meta.globEager](https://vitejs.dev/guide/features.html#glob-import) method
- [`Route`](/api/hydrogen/components/framework/route): Used to set up a route in Hydrogen that's independent of the file system

## API routes

> Note:
> If you want to use a third-party data source to render Hydrogen components, then refer to [Using Hydrogen components with a third-party data source](/custom-storefronts/hydrogen/data-sources#using-hydrogen-components-with-a-third-party-data-source). If you want to fetch data that goes alongside your Shopify product data and shopping experience, then refer to [Fetching supplementary data](/custom-storefronts/hydrogen/data-sources#fetching-supplementary-data).

API routes allow you to build your API in Hydrogen. Any server component within the `src/routes` directory that exports an API function will become an API route. The following examples show some common use cases for implementing API routes.

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

> Tip:
> Explore an [example implementation in GitHub](https://github.com/Shopify/hydrogen/blob/main/examples/template-hydrogen-default/src/routes/countries.server.jsx) that lazy loads [available countries](https://github.com/Shopify/hydrogen/blob/main/examples/template-hydrogen-default/src/components/CountrySelector.client.jsx) by an API route (`/api/countries`).

### Concatenating requests

Hydrogen allows concatenating requests in API routes in order to avoid extra network trips (waterfall requests). This is useful for HTML forms, where it is common to refresh the current page after the form submission is completed.

```jsx
// src/routes/my-page.server.jsx

export async function api(request) {
  if (request.method === 'POST') {
    // do some work here...
  }

  return new Request(request.url, {method: 'GET'});
}

export default function Page() {
  return (
    <form action="/my-page" method="POST">
      ...
    </form>
  );
}
```

## Next steps

- Learn about [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components), an opinionated data-fetching and rendering workflow for React apps.
- Learn how the [page server component](/custom-storefronts/hydrogen/framework/pages) receives props, which includes custom versions of `request` and `response`.
