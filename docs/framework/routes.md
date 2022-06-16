---
gid: 4431e3bd-069b-4027-b3e9-b013a9a6489d
title: Routes
description: Get familiar with the file-based routing system that Hydrogen uses.
---

The Hydrogen framework uses a file-based routing system. This guide provides an introduction to how routing works in your Hydrogen storefront.

## How routes work

All components added to the `src/routes` directory are registered as routes in `App.server.jsx`. Any filenames with brackets, like `[handle]`, are converted to a route parameter called `:handle`.

You can navigate between routes using the [`Link`](https://shopify.dev/api/hydrogen/components/framework/link) component or the [`useNavigate`](https://shopify.dev/api/hydrogen/hooks/framework/usenavigate) hook. You can use the [`useRouteParams`](https://shopify.dev/api/hydrogen/hooks/framework/userouteparams) hook to retrieve the parameters of an active route.

The following example shows how each `*.server.jsx` file maps to a different route in the Hydrogen app:

{% codeblock file, filename: "Hydrogen routes" %}

```
└── src
    ├── routes
        └── collections
            └── [handle].server.jsx // localhost:3000/collections/<handle>
        └── pages
            └── [handle].server.jsx // localhost:3000/pages/<handle>
        └── products
            └── [handle].server.jsx // localhost:3000/products/<handle>
        └── index.server.jsx // localhost:3000/
```

{% endcodeblock %}

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

The `handle` property is available from the hook `useRouteParams()`:

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

The [`Link`](https://shopify.dev/api/hydrogen/components/framework/link) component includes an optional `prefetch` prop that controls whether to prefetch a link source when a user signals intent. The default value is `true`.

If you want to disable link prefetching, then pass `preload={false}` to the `Link` component:

{% codeblock file, filename: 'Component.client.jsx' %}

```html
<Link prefetch={false} to="/path">Link</Link>
```

{% endcodeblock %}

By default, when a user hovers or focuses on the link for more than 100ms, a prefetch link tag is rendered for the React Server Components response path. If the user prematurely leaves or blurs the link, then the prefetch link tag isn't added.

## Catch all routes

You can extend dynamic routes to catch all paths by adding an ellipsis (...) inside the brackets. For example, `/routes/example/[...handle].server.jsx` will match `/example/a` and `/example/a/b`.

### Built-in routes

Hydrogen provides the following built-in routes:

- **`/__health`**: A health check route that responds with a 200 status and no body. You can use this route within your infrastructure to verify that your app is healthy and able to respond to requests.
- **`/__rsc`**: An internal route used to re-render server components. It's called by the Hydrogen frontend when the route changes, or when server props change. You should never need to manually request this route.
- **`/__event`**: An internal route used to save client observability events. You should never need to manually request this route.

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

- [`Router`](https://shopify.dev/api/hydrogen/components/framework/router): Provides the context for routing in your Hydrogen storefront
- [`FileRoutes`](https://shopify.dev/api/hydrogen/components/framework/fileroutes): Builds a set of default Hydrogen routes based on the output provided by Vite's [import.meta.globEager](https://vitejs.dev/guide/features.html#glob-import) method
- [`Route`](https://shopify.dev/api/hydrogen/components/framework/route): Used to set up a route in Hydrogen that's independent of the file system

## API routes

> Note:
> If you want to use a third-party data source to render Hydrogen components, then refer to [Using Hydrogen components with a third-party data source](https://shopify.dev/custom-storefronts/hydrogen/data-sources#using-hydrogen-components-with-a-third-party-data-source). If you want to fetch data that goes alongside your Shopify product data and shopping experience, then refer to [Fetching supplementary data](https://shopify.dev/custom-storefronts/hydrogen/data-sources#fetching-supplementary-data).

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
> Explore an [example implementation in GitHub](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/routes/countries.server.jsx) that lazy loads [available countries](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/components/CountrySelector.client.jsx) by an API route (`/api/countries`).

### Concatenating requests

You can concatenate requests in API routes to avoid extra network problems, such as waterfall requests. Concatenating requests is useful for HTML forms, where it's common to refresh the current page after a form is submitted.

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

## Props for creating custom experiences

Server components placed in the `src/routes` directory receive the following special props that you can use to create custom experiences:

| Prop       | Type               |
| ---------- | ------------------ |
| `request`  | `HydrogenRequest`  |
| `response` | `HydrogenResponse` |

Each server component receives props, which includes custom versions of `request` and `response` and any `serverProps` that you have passed from the client.

![Shows a diagram that illustrates how server components receive props](/assets/custom-storefronts/hydrogen/hydrogen-pages.png)

### `request`: `HydrogenRequest`

You might want to inspect incoming requests for cookies, headers or other signals that might require a unique response.

All server components receive a `request` prop containing a Hydrogen-specific version of [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request).

In addition to the standard methods, `HydrogenRequest` exposes a `cookies` helper, which is a simple `Map` of cookie values:

{% codeblock file %}

```jsx
function MyPage({request}) {
  if (request.headers.get('my-custom-header') === SOME_VALUE) {
    // Do something based on a header
  }

  if (request.cookies.get('my-cookie') === OTHER_VALUE) {
    // Do something based on a cookie
  }
}
```

{% endcodeblock %}

In some cases, you might want to use `HydrogenRequest.normalizedUrl` to access the intended URL rather than the pathname encoded for a [React Server Components request](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components):

{% codeblock file %}

```jsx
function MyPage({request}) {
  // 🔴 You probably don't want to read `url`:
  console.log(request.url);
  // https://example.com/__rsc?state=%7B%22pathname%22%3A%22%2Fproducts%22%2C%22search%22%3A%22%22%7D

  // ✅ You probably want the `normalizedUrl`:
  console.log(request.normalizedUrl);
  // https://example.com/products
}
```

{% endcodeblock %}

### `response`: `HydrogenResponse`

You might want to customize the response returned from the Hydrogen server. For example, set a different status code or define custom headers.

All server components receive a `response` prop containing a Hydrogen-specific version of [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response).

#### `response.cache()`

If you want to modify the [full-page cache options](/custom-storefronts/hydrogen/framework/cache), then you can call `cache()` on the response object:

{% codeblock file %}

```jsx
export default function MyProducts({response}) {
  response.cache({
    // Cache the page for one hour.
    maxAge: 60 * 60,
    // Serve the stale page for up to 23 hours while getting a fresh response in the background.
    staleWhileRevalidate: 23 * 60 * 60,
  });
}
```

{% endcodeblock %}

#### `response.doNotStream()`

By default, Hydrogen [streams SSR responses](https://shopify.dev/custom-storefronts/hydrogen/framework/streaming-ssr). However, you can also disable streaming for each route and return a fully buffered response. This is helpful in scenarios like [handling custom SEO bots](https://shopify.dev/custom-storefronts/hydrogen/framework/seo#checking-for-custom-robots). To disable streaming, call `response.doNotStream()`:

{% codeblock file %}

```js
export default function CustomPage({response}) {
  response.doNotStream();

  // ...
}
```

{% endcodeblock %}

> Tip:
> There are [performance benefits](https://shopify.dev/custom-storefronts/hydrogen/best-practices/performance) to streaming. You shouldn't completely disable streaming for all of your storefront's routes.

You can use `response` to set headers or status codes using the `Response` API:

{% codeblock file %}

```jsx
export default function CustomPage({response}) {
  response.doNotStream();

  response.headers.set('custom-header', 'value');
  response.status = 201;

  // ...
}
```

{% endcodeblock %}

> Caution:
> You must call `response.doNotStream()` before any calls to `fetchSync`, `useQuery` or `useShopQuery` to prevent streaming while the Suspense data is resolved.

#### `response.redirect()`

If you want to return users to a different URL, use `response.redirect()` in your server components.

{% codeblock file %}

```jsx
export default function PageThatShouldRedirect({response}) {
  return response.redirect('/new-page');
}
```

{% endcodeblock %}

The `redirect` function accepts a `location` URL and an optional `statusCode`, which defaults to `307`:

{% codeblock file %}

```jsx
// This redirect function only supports initial server-rendered page responses. It doesn't yet support client-navigated responses.
return response.redirect('https://yoursite.com/new-page', 301);
```

{% endcodeblock %}

> Caution:
> You must call `return response.redirect()` before any calls to `fetchSync`, `useQuery` or `useShopQuery` to prevent streaming while the Suspense data is resolved, or use `response.doNotStream()` to prevent streaming altogether on the response. The value must also be returned.

### Server props

In addition to `request` and `response` props, any props you manage with [`setServerProps`](https://shopify.dev/custom-storefronts/hydrogen/framework/server-props) are passed to each of your server components as props:

{% codeblock file %}

```jsx
export default function MyPage({custom, props, here}) {
  // Use custom server props
}
```

{% endcodeblock %}

## TypeScript

Hydrogen supports TypeScript out of the box. When building route components, you can use the provided TypeScript types to improve your developer experience:

{% codeblock file %}

```tsx
import type {
  HydrogenApiRoute,
  HydrogenApiRouteOptions,
  HydrogenRequest,
  HydrogenRouteProps,
} from '@shopify/hydrogen';

export default function MyPage(props: HydrogenRouteProps) {
  //
}

export const api: HydrogenApiRoute = async(request, options) => {
  //
}

// Alternate version of `api`:
export async function api(request: HydrogenRequest, options: HydrogenApiRouteOptions) {

}
```

{% endcodeblock %}

## Related components and hooks

- [`Link`](https://shopify.dev/api/hydrogen/components/framework/link)
- [`Router`](https://shopify.dev/api/hydrogen/components/framework/router)
- [`FileRoutes`](https://shopify.dev/api/hydrogen/components/framework/fileroutes)
- [`Route`](https://shopify.dev/api/hydrogen/components/framework/route)
- [`useNavigate`](https://shopify.dev/api/hydrogen/hooks/framework/usenavigate)
- [`useRouteParams`](https://shopify.dev/api/hydrogen/hooks/framework/userouteparams)
- [`useQuery`](https://shopify.dev/api/hydrogen/hooks/global/usequery)
- [`useShopQuery`](https://shopify.dev/api/hydrogen/hooks/global/useshopquery)
- [`fetchSync`](https://shopify.dev/api/hydrogen/hooks/global/fetchsync)

## Next steps

- Learn about [Hydrogen's configuration properties](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config) and how to change the location of the configuration file.
- Learn about how Hydrogen consumes data from different [sources](https://shopify.dev/custom-storefronts/hydrogen/data-sources).
- Learn how to manage [cache options](https://shopify.dev/custom-storefronts/hydrogen/framework/cache) for Hydrogen storefronts.
- Improve your app's loading performance with [streaming SSR and Suspense](https://shopify.dev/custom-storefronts/hydrogen/framework/streaming-ssr).
- Learn how to [manage your server props](https://shopify.dev/custom-storefronts/hydrogen/framework/server-props) during your development process.
