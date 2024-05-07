# Manage routes


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



The Hydrogen framework uses a [file-based routing system](/tutorials/routing/). This guide explains how to perform some common tasks for managing routes.

## Retrieve the `handle` property

The routes are registered in `App.server.jsx` and Hydrogen converts `[handle]` to `:handle`. [Refer to an example](/tutorials/routing/index.md#example).

You can retrieve the `handle` property by using the [`useRouteParams` hook](/hooks/framework/userouteparams/):

```jsx
// [handle].server.jsx

export default function Product() {
  const {handle} = useRouteParams();
  return <div>{handle}</div>;
}
```



## Provide a custom static implementation

You can also provide a custom static implementation of a dynamic page to override the default.

In the following example, any requests to `/products/hoodie` are rendered using `hoodie.server.jsx` instead of `[handle].server.jsx`:

```
/routes/products/hoodie.server.jsx
/routes/products/[handle].server.jsx
```



### Prefetch a link source

The [`Link`](/components/framework/link/) component includes an optional `prefetch` prop that controls whether to prefetch a link source when a user signals intent. The default value is `true`.

If you want to disable link prefetching, then pass `prefetch={false}` to the `Link` component:

```jsx
// Component.client.jsx

<Link prefetch={false} to="/path">Link</Link>
```



By default, when a user hovers or focuses on the link for more than 100ms, a prefetch link tag is rendered for the React Server Components response path. If the user prematurely leaves or blurs the link, then the prefetch link tag isn't added.

## Disable prefetching link sources

The [`Link`](/components/framework/link/) component includes an optional `prefetch` prop that controls whether to prefetch a link source when a user signals intent. The default value is `true`.

If you want to disable link prefetching, then pass `prefetch={false}` to the `Link` component:

```jsx
// Component.client.jsx

<Link prefetch={false} to="/path">Link</Link>
```



By default, when a user hovers or focuses on the link for more than 100ms, a prefetch link tag is rendered for the React Server Components response path. If the user prematurely leaves or blurs the link, then the prefetch link tag isn't added.

## Catch all routes

You can extend dynamic routes to catch all paths by adding an ellipsis (...) inside the brackets. For example, `/routes/example/[...handle].server.jsx` will match `/example/a` and `/example/a/b`.

Learn more about [Hydrogen's built-in routes](/tutorials/routing/index.md#built-in-routes).

### Example

The following example shows how to obtain catch all routes data using `location.pathname`:

```jsx
// [...handle].server.jsx

export default function({request}) {
  const { pathname } = new URL(request.url);)
}
```



## API routes

> Note:
> If you want to use a third-party data source to render Hydrogen components, then refer to [Using Hydrogen components with a third-party data source](/tutorials/data-sources/work-with-3p-data-sources.md#use-hydrogen-components-with-a-third-party-data-source). If you want to fetch data that goes alongside your Shopify product data and shopping experience, then refer to [Fetching supplementary data](/tutorials/data-sources/work-with-3p-data-sources#fetch-supplementary-data).

Any server component within the `src/routes` directory that exports an API function will become an API route.

The following examples show some common use cases for implementing API routes:

### Set a route that returns a JSON response

The following example shows an API route that returns a JSON response:

```jsx


export function api(request, {params}) {
  return new Response(JSON.stringify({data: 1}), {
    headers: {'Content-Type': 'application/json'},
  });
}
```



### Set a URL redirect

The following example shows how to set up a URL redirect with a status code of `301`:

```jsx


export function api(request, {params}) {
  return new Response(null, {
    status: 301,
    headers: {Location: 'https://shopify.dev/custom-storefronts/hydrogen'},
  });
}
```



### Switch the HTTP method

The following example shows how to switch the HTTP method for the action performed by an API:

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



### Use API routes to read a request body

The following example shows how to use API routes to read a request body:

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



> Tip:
> Explore an [example implementation in GitHub](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/routes/api/countries.server.ts) that lazy loads [available countries](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/components/CountrySelector.client.tsx) by an API route (`/api/countries`).

### Concatenate requests

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


## Create custom experiences with props

Server components placed in the `src/routes` directory [receive special props](/tutorials/routing/index.md#props-for-creating-custom-experiences) that you can use to create custom experiences:

The following are some examples.

### `request`: `HydrogenRequest`

You might want to inspect incoming requests for cookies, headers or other signals that might require a unique response.

All server components receive a `request` prop containing a Hydrogen-specific version of [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request).

In addition to the standard methods, `HydrogenRequest` exposes a `cookies` helper, which is a simple `Map` of cookie values:

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



In some cases, you might want to use `HydrogenRequest.normalizedUrl` to access the intended URL rather than the pathname encoded for a [React Server Components request](/tutorials/react-server-components/):

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



### Customize the response returned from the Hydrogen server

**Prop**: `response`: `HydrogenResponse`.

You can customize the response returned from the Hydrogen server, such as setting a different status code or defining a custom headers.

All server components receive a `response` prop containing a Hydrogen-specific version of [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response).

### Modify full-page cache options

**Prop**: `response.cache()`

If you want to modify the [full-page cache options](/tutorials/querying/cache/), then you can call `cache()` on the response object:

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



### Disable streaming for routes

> Caution:
> There are [performance benefits](/tutorials/best-practices/performance/) to streaming. You shouldn't completely disable streaming for all of your storefront's routes.

**Prop**: `response.doNotStream()`

By default, Hydrogen [streams SSR responses](/tutorials/streaming-ssr/). However, you can also disable streaming for each route and return a fully buffered response. This is helpful in scenarios like [handling custom SEO bots](/tutorials/seo/manage-seo.md#check-for-custom-robots).

To disable streaming, call `response.doNotStream()`:

```js


export default function CustomPage({response}) {
  response.doNotStream();

  // ...
}
```



### Set headers and status codes

**Prop**: `response`

You can use `response` to set headers or status codes using the `Response` API:

```jsx


export default function CustomPage({response}) {
  response.doNotStream();

  response.headers.set('custom-header', 'value');
  response.status = 201;

  // ...
}
```



> Caution:
> You must call `response.doNotStream()` before any calls to `fetchSync`, `useQuery` or `useShopQuery` to prevent streaming while the Suspense data is resolved.

### Redirect to a URL

**Prop**: `response.redirect()`

If you want to return users to a different URL, then use `response.redirect()` in your server components.

```jsx


export default function PageThatShouldRedirect({response}) {
  return response.redirect('/new-page');
}
```



The `redirect` function accepts a `location` URL and an optional `statusCode`, which defaults to `307`:

```jsx


// This redirect function only supports initial server-rendered page responses. It doesn't yet support client-navigated responses.
return response.redirect('https://yoursite.com/new-page', 301);
```



> Caution:
> You must call `return response.redirect()` before any calls to `fetchSync`, `useQuery` or `useShopQuery` to prevent streaming while the Suspense data is resolved, or use `response.doNotStream()` to prevent streaming altogether on the response. The value must also be returned.

### Server props

In addition to `request` and `response` props, any props you manage with [`setServerProps`](/tutorials/server-props/) are passed to each of your server components as props:

```jsx


export default function MyPage({custom, props, here}) {
  // Use custom server props
}
```


