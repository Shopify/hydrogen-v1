---
gid: 4431e3bd-069b-4027-b3e9-b013a9a6489d
title: Routes
description: Get familiar with the file-based routing system that Hydrogen uses.
---

The Hydrogen framework uses a file-based routing system. This guide provides an introduction to how routing works in your Hydrogen app.

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

- [`Router`](https://shopify.dev/api/hydrogen/components/framework/router): Provides the context for routing in your Hydrogen app
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
> Explore an [example implementation in GitHub](https://github.com/Shopify/hydrogen/blob/main/examples/template-hydrogen-default/src/routes/countries.server.jsx) that lazy loads [available countries](https://github.com/Shopify/hydrogen/blob/main/examples/template-hydrogen-default/src/components/CountrySelector.client.jsx) by an API route (`/api/countries`).

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

| Prop       | Type                      |
| ---------- | ------------------------- |
| `request`  | `ServerComponentRequest`  |
| `response` | `ServerComponentResponse` |

Each server component receives props, which includes custom versions of `request` and `response` and any `serverProps` that you have passed from the client.

![Shows a diagram that illustrates how server components receive props](/assets/custom-storefronts/hydrogen/hydrogen-pages.png)

### `request`: `ServerComponentRequest`

You might want to inspect incoming requests for cookies, headers or other signals that might require a unique response.

All server components receive a `request` prop containing a Hydrogen-specific version of [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request).

In addition to the standard methods, `ServerComponentRequest` exposes a `cookies` helper, which is a simple `Map` of cookie values:

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

### `response`: `ServerComponentResponse`

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

By default, Hydrogen [streams SSR responses](https://github.com/reactwg/react-18/discussions/37). To customize a response, you need to tell Hydrogen that your server component plans to modify it in some way by calling `response.doNotStream()`:

{% codeblock file %}

```js
export default function CustomPage({response}) {
  response.doNotStream();

  // ...
}
```

{% endcodeblock %}

You can use `response` to set headers or status codes using the `Response` API:

{% codeblock file %}

```jsx
export default function CustomPage({response}) {
  response.doNotStream();

  response.headers.set('custom-header', 'value');

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

#### `response.send()`

If you want to return a different response body than React-rendered HTML, then pass the custom body to `response.send()` and return it from your server component:

{% codeblock file %}

```jsx
export default function CustomPage({response}) {
  response.doNotStream();

  response.headers.set('content-type', 'application/json');

  return response.send(JSON.stringify({data: 'here'}));
}
```

{% endcodeblock %}

Since this code lives inside a server component, you can use [`useShopQuery`](/api/hydrogen/hooks/global/useshopquery) to populate your [custom responses](#custom-responses) with Shopify data.

### Server props

In addition to `request` and `response` props, any props you manage with [`setServerProps`](/custom-storefronts/hydrogen/framework/server-props) is passed to each of your server components as props:

{% codeblock file %}

```jsx
function MyPage({custom, props, here}) {
  // Use custom server props
}
```

{% endcodeblock %}

## Custom responses

Custom responses are React components that you can use to compose complex functionality in a response. This section provides examples that show some creative ways to use custom responses in your Hydrogen app.

Custom responses provide the following benefits:

- You don't have to use a custom API function to respond with JSON or another format.
- You don't need to use another file or a different pattern to respond with something that's not a standard HTML response.
- You have complete freedom over the response.

### Create a custom sitemap

The following example shows how to create a custom sitemap by adding a new server component called `routes/sitemap.xml.server.jsx`. The custom response object returns the sitemap.

{% codeblock file, filename: '/routes/my-products.server.jsx' %}

```jsx
import {flattenConnection, useShopQuery} from '@shopify/hydrogen';
import gql from 'graphql-tag';

export default function Sitemap({response}) {
  response.doNotStream();

  const {data} = useShopQuery({query: QUERY});

  response.headers.set('content-type', 'application/xml');

  return response.send(shopSitemap(data));
}

function shopSitemap(data) {
  return `
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
    >
      ${flattenConnection(data.products)
        .map((product) => {
          return `
          <url>
            <loc>
              https://hydrogen-preview.myshopify.com/products/${product.handle}
            </loc>
            <lastmod>${product.updatedAt}</lastmod>
            <changefreq>daily</changefreq>
            <image:image>
              <image:loc>
                ${product?.images?.edges?.[0]?.node?.url}
              </image:loc>
              <image:title>
                ${product?.images?.edges?.[0]?.node?.altText ?? ''}
              </image:title>
              <image:caption />
            </image:image>
          </url>
        `;
        })
        .join('')}
    </urlset>`;
}

const QUERY = gql`
  query Products {
    products(first: 100) {
      edges {
        node {
          updatedAt
          handle
          featuredImage {
            url
            altText
          }
        }
      }
    }
  }
`;
```

{% endcodeblock %}

### Build a JSON API

In modern app frameworks, it's common to create custom API endpoints in your own framework powered by the hosting platform you're using. In other frameworks, these API endpoints provide helpful ways to handle lazy-loading, Ajax type incremental data, or POST requests to mutate an external data store. For example, you might want to send a POST request to write to a custom data store after submitting a form.

The following example shows how to build a JSON API with custom responses by adding a new server component called `/routes/my-products.server.jsx`. The custom response object returns the JSON API:

{% codeblock file, filename: '/routes/my-products.server.jsx' %}

```jsx
import {flattenConnection, useShopQuery} from '@shopify/hydrogen';
import gql from 'graphql-tag';

export default function MyProducts({response}) {
  response.doNotStream();

  const {data} = useShopQuery({query: QUERY});

  response.headers.set('content-type', 'application/json');

  return response.send(JSON.stringify(flattenConnection(data.products)));
}

const QUERY = gql`
  query Products {
    products(first: 100) {
      edges {
        node {
          updatedAt
          handle
          featuredImage {
            url
            altText
          }
        }
      }
    }
  }
`;
```

{% endcodeblock %}

### Generate a spreadsheet

You might want to generate a spreadsheet that includes product data from your store.

The following example shows how to generate comma-separated values (CSV) file by adding a new server component called `/routes/spreadsheet.csv.server.jsx`. The custom response object returns the spreadsheet:

{% codeblock file, filename: '/routes/spreadsheet.csv.server.jsx' %}

```jsx
import gql from 'graphql-tag';
import {flattenConnection, useShopQuery} from '@shopify/hydrogen';

export default function Report({response}) {
  response.doNotStream();

  const {data} = useShopQuery({query: QUERY});

  response.headers.set('content-type', 'application/csv');

  return response.send(
    flattenConnection(data.products)
      .map((product) => [product.id, product.title, product.handle].join(','))
      .join('\n')
  );
}

const QUERY = gql`
  {
    products(first: 10) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
`;
```

{% endcodeblock %}

### Generate PDFs

You might want to generate brochures for products in a Shopify store.

The following example shows how to generate a downloadable PDF for a product in a store by installing `@react-pdf/renderer`:

```bash
yarn add @react-pdf/renderer
```

After you've installed `@react-pdf/renderer`, create a new server component called `/routes/brochure.pdf.server.jsx`:

{% codeblock file, filename: '/routes/brochure.pdf.server.jsx' %}

```jsx
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  renderToString,
  Image,
} from '@react-pdf/renderer';
import gql from 'graphql-tag';
import {useShopQuery} from '@shopify/hydrogen';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    width: '50%',
  },
  description: {
    fontSize: 10,
  },
});

export default function Brochure({response}) {
  response.doNotStream();

  const {data} = useShopQuery({query: QUERY});

  const product = data.productByHandle;

  const BrochureDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>{product.title}</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
        <View style={styles.section}>
          <Image src={product.images.edges[0].node.url} />
        </View>
      </Page>
    </Document>
  );

  response.headers.set('content-type', 'application/pdf');

  return response.send(renderToString(<BrochureDocument />));
}

const QUERY = gql`
  {
    productByHandle(handle: "snowboard") {
      title
      handle
      description
      featuredImage {
        url
      }
    }
  }
`;
```

{% endcodeblock %}

### Interacting with custom responses on the browser

When you build custom responses, you might want to call them from the browser using `fetch`. For example, you could check an API endpoint like `/api/views`.

To call a custom response from the client, you need to tell Hydrogen about the request using a custom `accept` header value called `application/hydrogen`. You can combine this header value with any other `accept` value. This tells Hydrogen to handle the response using a server component rather than attempting to load an asset:

{% codeblock file %}

```js
await fetch('/api/views', {
  headers: {
    accept: 'application/hydrogen, application/json',
  },
});
```

{% endcodeblock %}

## Next steps

- Learn about [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components), an opinionated data-fetching and rendering workflow for React apps.
