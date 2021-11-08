The Hydrogen framework includes page server components. This guide describes how page server components receive props.

## How pages work

Hydrogen uses file-based routing, and any pages added to the `src/pages` folder will be automatically registered as routes by the app.

You might want to add a new page and have it display at `localhost:3000/test`. You can do this by adding a new file to `src/pages`. For example, if you add `test.server.jsx` to `src/pages`, then the page displays at `localhost:3000/test`.

> Note:
> If you add the new page to `src/pages/pages`, then the new page displays at `localhost:3000/pages/test`.

The following example shows how each `*.server.jsx` file maps to a different page route in the Hydrogen app:

{% codeblock file, filename: "Hydrogen page routes" %}

```
└── src
    ├── pages
        └── blogs
            └── [handle]
            └── [handle].server.jsx // localhost:3000/blogs/<handle>
        └── collections
            └── [handle].server.jsx // localhost:3000/collections/<handle>
        └── pages
            └── [handle].server.jsx // localhost:3000/pages/<handle>
        └── products
            └── [handle].server.jsx // localhost:3000/products/<handle>
        └── index.server.jsx // localhost:3000/
```

{% endcodeblock %}

## Props

Server components placed in the `src/pages` directory receive the following special props that you can use to create custom experiences:

| Prop       | Type                      |
| ---------- | ------------------------- |
| `request`  | `ServerComponentRequest`  |
| `response` | `ServerComponentResponse` |

Each page server component receives props, which includes custom versions of `request` and `response` and any `serverState` that you have passed from the client.

![Shows a diagram that illustrates how page serve components receive props](/assets/custom-storefronts/hydrogen/hydrogen-pages.png)

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
> You must call `response.doNotStream()` before any calls to `useQuery` or `useShopQuery` to prevent streaming while the Suspense data is resolved.

### `response.send()`

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

Since this code lives inside a server component, you can use [`useShopQuery`](/api/hydrogen/hooks/global/useshopquery) to populate your [custom responses](#creative-ways-to-use-custom-responses) with Shopify data.

### `response.cache()`

If you want to modify the [full-page cache options](/api/hydrogen/framework/cache), then you can call `cache()` on the response object:

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

## Server state props

In addition to `request` and `response` props, any state you manage with [`setServerState`](/api/hydrogen/framework/server-state) is passed to each of your page server components as props:

{% codeblock file %}

```jsx
function MyPage({custom, state, here}) {
  // Use custom server state
}
```

{% endcodeblock %}

## Interacting with custom responses on the browser

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

## Creative ways to use custom responses

This section provides examples that show some creative ways to use custom responses in your Hydrogen app. Custom responses are React components that you can use to compose complex functionality in a response.

Custom responses provide the following benefits:

- You don't have to use a custom API function to respond with JSON or another format.
- You don't need to use another file or a different pattern to respond with something that's not a standard HTML response.
- You have complete freedom over the response.

### Create a custom sitemap

The following example shows how to create a custom sitemap by adding a new server component called `pages/sitemap.xml.server.jsx`. The custom response object returns the sitemap.

> Tip:
> Hydrogen's starter includes a `pages/sitemap.xml.server.jsx` component which serves a sitemap at `/sitemap.xml`.

{% codeblock file, filename: '/pages/my-products.server.jsx' %}

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
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
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

The following example shows how to build a JSON API with custom responses by adding a new server component called `/pages/my-products.server.jsx`. The custom response object returns the JSON API:

{% codeblock file, filename: '/pages/my-products.server.jsx' %}

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
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
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

The following example shows how to generate comma-separated values (CSV) file by adding a new server component called `/pages/spreadsheet.csv.server.jsx`. The custom response object returns the spreadsheet:

{% codeblock file, filename: '/pages/spreadsheet.csv.server.jsx' %}

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

After you've installed `@react-pdf/renderer`, create a new server component called `/pages/brochure.pdf.server.jsx`:

{% codeblock file, filename: '/pages/brochure.pdf.server.jsx' %}

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
      images(first: 1) {
        edges {
          node {
            url
          }
        }
      }
    }
  }
`;
```

{% endcodeblock %}

## Next steps

- Learn about [React Server Components](/api/hydrogen/framework/react-server-components), an opinionated data-fetching and rendering workflow for React apps.
- Learn how to manage the [state on the server](/api/hydrogen/framework/server-state) as you're building your Hydrogen app.
- Get familiar with the [file-based routing system](/api/hydrogen/framework/routes) that Hydrogen uses.
