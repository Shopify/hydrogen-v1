# Performance best practices for Hydrogen


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



Hydrogen custom storefronts should be built with performance in mind, so that merchants and their customers can benefit from the fastest, most reliable online shopping experiences.

This guide describes best practices for making your Hydrogen custom storefront performant.

## React Server Components

Hydrogen is modelled after [React Server Components](/tutorials/react-server-components/), an approach that offers an opinionated data-fetching and rendering workflow for React apps.

As you develop your Hydrogen custom storefront, you'll need to determine what to render on the server, what to the render on the client, and what to render on both the server and client. Making the right choices will result in performance benefits.

### Build shared components by default

When you need to build a component from scratch, start with a shared component. The functionality of shared components can execute in both server and client contexts.

Starting in the middle helps you ask important questions:

  - Can this code run only in the server or client?

  - Should this code run only in the server or client?

#### Examples

- [A shared component that represents an icon](/templates/demo-store/src/components/elements/Icon.tsx)
- [A shared component that displays a section on a page](/templates/demo-store/src/components/elements/Section.tsx)

### Build server components as often as possible

The majority of the components in your app should be server components. Consider building a server component if any of the following use cases apply:

  - The component includes code that shouldn’t be exposed on the client, like proprietary business logic and secrets.

  - The component won’t be used by a client component.

  - The code never executes on the client.

  - The code needs to access the filesystem or databases, which aren’t available on the client.

  - The code fetches data from the Storefront API.

  - The code renders static or infrequently updated content, such as an About page.

#### Examples

- [A server component that renders account details](/templates/demo-store/src/components/account/AccountDetails.client.tsx)
- [A server component that renders a 404 page](/templates/demo-store/src/components/global/NotFound.server.tsx)

### Build client components in rare cases

Generally, you don't need to convert the entire component into a client component - only the logic necessary for the client needs to be extracted out into a client component. Consider building a client component if any of the following uses cases apply:

  - You require client-side interactivity.

  - You're using the [`useState`](https://reactjs.org/docs/hooks-reference.html#usestate) or [`useReducer`](https://reactjs.org/docs/hooks-reference.html#usereducer) React hooks.

  - You're using lifecycle rendering logic (for example, implementing the React [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect) hook).

  - You're making use of a third-party library that doesn’t support React Server Components.

  - You're using browser APIs that aren’t supported on the servers.

#### Examples

- [A client component that renders product information](templates/demo-store/src/components/product/ProductInfo.client.tsx)
- [A client component that renders an account login form](/templates/demo-store/src/components/account/AccountLoginForm.client.tsx)

## Data fetching

Delivering fast server-side responses requires fast and efficient [first-party (Shopify)](/tutorials/data-sources/index.md#shopify-data-source) and [third-party data access](/tutorials/data-sources/work-with-3p-data-sources).

### First-party (Shopify) data source

Consider [deploying your Hydrogen custom storefront on Oxygen](/tutorials/deployment.md#deploy-to-oxygen), Shopify's recommended deployment platform for Hydrogen storefronts. Oxygen provides caching out of the box for routes and sub-requests.

### Third-party data source

If you're fetching from a third-party data source, then the runtime exposes the standard [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) enhanced with smart cache defaults and [configurable caching strategies](/tutorials/querying/cache/).

The following example shows how to fetch from a third-party data source and make sure that customers get the quickest response possible while also displaying the latest data:

```js
// 3p-hydrogen-fetch.js

import {fetchSync, CacheLong} from '@shopify/hydrogen';
function MyServerComponent() {
  const {data} = fetchSync('https://my.3p.com/data.json', {
    cache: CacheLong(),
  }).json();
}
```



### Caching and stale-while-revalidate

[Caching](/tutorials/querying/cache/) is a fundamental building block of a good shopping experience. By configuring `maxAge` and `staleWhileRevalidate`, you have full control over data freshness and the revalidation strategy.

For example, if a response is considered stale due to being older than `maxAge`, but it's still within the additional time window provided by `staleWhileRevalidate`, then the response is used. The data is also asynchronously revalidated in preparation for the next request. This keeps your content fresh and your store performant.

If a stale response falls outside the `staleWhileRevalidate` window, then the response is revalidated before being delivered.

Hydrogen's [caching strategies](/tutorials/querying/cache.md#caching-strategies) include `maxAge` and `staleWhileRevalidate` values by default:

```js
// data-fetching-caching-strategies.js

// First-party request
import { useShopQuery, CacheLong } from "@shopify/hydrogen";
export default function Example() {
  const {
    data: { shop },
  } = useShopQuery({
    query: `query shopName { shop { name } }`,
    cache: CacheLong(), // max-age=900, stale-while-revalidate=900
  });
  return <p>Cached a response from the Storefront API.</p>;
}

// Third-party simple fetch
import { fetchSync, CacheLong } from "@shopify/hydrogen";
export default function Example() {
  const data = fetchSync("https://my.3p.com/data.json", {
    cache: CacheLong(), // max-age=900, stale-while-revalidate=900
  }).json();
  return <p>Cached a response from a third-party simple fetch.</p>;
}

// Third-party SDK
import { useQuery, CacheLong } from "@shopify/hydrogen";
export default function Example() {
  const { data } = useQuery(
    ["unique", "key"],
    async () => {
      return await exampleSDK.get('some-resource')
    },
    {
      cache: CacheLong(), // maxAge=900, stale-while-revalidate=900
    }
  );
  return <p>Cached a response from a third-party SDK.</p>;
}

```



If you don't want to use the caching strategies provided by Hydrogen, then you can create your own using a `CustomCache` strategy:

```js
// data-fetching-custom-caching-strategy.js

import { useShopQuery, CacheCustom } from "@shopify/hydrogen";
export default function Example() {
  const {
    data: { shop },
  } = useShopQuery({
    query: `query shopName { shop { name } }`,
    cache: CacheCustom({
      maxAge: 30,
      staleWhileRevalidate: 30,
    })
  });
  return <p>Cached a response from the Storefront API using custom cache values.</p>;
}
```


> Note:
> Sub-request caching is disabled by default during development. To learn how to enable sub-request caching, refer to [Sub-request caching](/tutorials/querying/cache.md#sub-request-caching).

### Avoid overfetching

Requesting too much data from the Storefront API or from other resources can slow down your Hydrogen storefront. You should make sure that your Hydrogen app is only requesting that data it needs to render a route.

To help you request only the data that you need, Hydrogen includes a [`log`](/utilities/log/) utility that identifies unused data returned from [`useShopQuery`](/hooks/global/useshopquery/). The `log` utility prints unused query properties in the server console to highlight potential data over-fetching.

To enable logging for unused query properties, set the `logger.showUnusedQueryProperties` option to `true` in your [Hydrogen configuration file](/tutorials/configuration/index.md#logger).

Then, visit your terminal that's running the development server to see any notices printed by the utility:

```bash
GET Server Components 200 878.05 ms  {"pathname":"/products/snowboard","search":""}

WARN:  Potentially overfetching fields in GraphQL query.
Query `product` in file `/src/routes/products/[handle].server.jsx:30:29` (function `Product`):
• product.media.sources.mimeType
• product.media.sources.url
• product.media.embedUrl
• product.media.host
• product.media.sources.url
• product.metafields.reference.id
  ...and 25 more
Examine the list of fields above to confirm that they are being used
```



## Pages and subrequests

Hydrogen doesn't require that all requests are server-rendered. [Routes and subrequests](/tutorials/routing/) with static or infrequently updated content can be served from the edge.

For example, a marketing page that’s typically static can be [cached](/tutorials/querying/cache/), served directly from the CDN edge, and asynchronously revalidated with the help of the `CacheLong()` caching strategy:

```js
// routes/products/[handle].server.jsx

import {CacheLong} from '@shopify/hydrogen';
export default function MarketingPage({response}) {
  response.cache(CacheLong());
 // ...
}
```



## Suspense boundaries

Data fetching in Hydrogen is powered by [React Suspense](https://reactjs.org/docs/react-api.html#reactsuspense). When you define a Suspense boundary, you provide a fallback component to render until the contents of the Suspense boundary is resolved.

It's important to wrap your server components that fetch data in Suspense boundaries. This allows Hydrogen to stream the fallback components to your users immediately rather than waiting for all of the data to be resolved.

### Placement of Suspense boundaries

Wrap a Suspense boundary around the content that suspends, not inside of it:

```js
// routes/products/[handle].server.jsx

// 🔴 Don't do this:
export default function Product() {
  const {data} = useShopQuery({ ... });

  return (
    <Suspense fallback="Loading...">
      <h1>{data.product.title}</h1>
    </Suspense>
  );
}

// ✅ Do this:
export default function Product() {
  return (
    <Suspense fallback="Loading...">
      <ProductDetails />
    </Suspense>
  );
}

function ProductDetails() {
  const {data} = useShopQuery({ ... });

  return <h1>{data.product.title}</h1>
}
```



### Prioritizing components

It's important to prioritize some content over other content. For example, you might want some product details like title, image, and description to load before other product details, like reviews or related products.

You can prioritize some components and defer other components by wrapping Suspense boundaries around the deferred components in the same app tree. This allows Hydrogen to stream the prioritized component's data first, and fetch the data for the deferred components asynchronously:

```js
// routes/products/[handle].server.jsx

export default function Product() {
  return (
    // First, this component suspends and resolves.
    <ProductDetails />

    // Then, these two components return fallbacks and resolve later.
    <Suspense fallback="Loading reviews...">
      <ProductReviews />
    </Suspense>
    <Suspense fallback="Loading related products...">
      <RelatedProducts />
    </Suspense>
  );
}

function ProductDetails() {
  const {data} = useShopQuery({ ... });

  //
}

function ProductReviews() {
  const {data} = useShopQuery({ ... });

  //
}

function RelatedProducts() {
  const {data} = useShopQuery({ ... });

  //
}
```



### Split queries

Some data sources might load more quickly than others. If your Hydrogen storefront is responding slowly, then you might want to evaluate how you're writing your queries and consider splitting them up.

For example, requesting a shop's name and information from the Storefront API is very quick, while loading many collections with nested product details will be less quick. Because both pieces of data are requested in the same query, the response will only be as quick as the slowest resource:

```js
// routes/products/[handle].server.jsx

export default function Product() {
  return (
    <Suspense fallback="Loading...">
      <ProductPage />
    </Suspense>
  );
}

const QUERY = `
  query EverythingData {
    shop {
      name
    }

    collection(handle: "shoes") {
      products(first: 250) {
        nodes {
          title
        }
      }
    }
  }
`;

function ProductPage() {
  const {data} = useShopQuery({query: QUERY});

  return (
    <>
      <h1>{data.shop.name}</h1>
      <p>Products in this collection: {data.collection.products.nodes.length}</p>
    </>
  );
}
```



Instead, you can split the query for basic storefront data from the query for collection information to make the storefront data load quicker:

```js
// routes/products/[handle].server.jsx

export default function Product() {
  return (
    <>
      <Suspense fallback="Loading Storefront Info...">
        <StorefrontInfo />
      </Suspense>
      <Suspense fallback="Loading Product Info...">
        <ProductPage />
      </Suspense>
    </>
  );
}

const STOREFRONT_QUERY = `
  query StorefrontData {
    shop {
      name
    }
  }
`;

function StorefrontInfo() {
  const {data} = useShopQuery({query: STOREFRONT_QUERY});

  return <h1>{data.shop.name}</h1>;
}

const COLLECTION_QUERY = `
  query CollectionData {
    collection(handle: "shoes") {
      products(first: 250) {
        nodes {
          title
        }
      }
    }
  }
`;

function ProductPage() {
  const {data} = useShopQuery({query: COLLECTION_QUERY});

  return <p>Products in this collection: {data.collection.products.nodes.length}</p>;
}
```



### Combine and re-use queries

Sometimes it makes sense to split queries, and other times it makes more sense to combine and re-use queries. You can experiment with combining or splitting your queries to see what approach works better for your use case.

Hydrogen de-duplicates identical requests made to [`fetchSync`](/hooks/global/fetchsync/), [`useShopQuery`](/hooks/global/useshopquery/) and [`useQuery`](/hooks/global/usequery/). This means that if you fetch a data resource in one component, then fetching an identical data resource in another component won't result in an additional API request.

You can use this behavior to your advantage. For example, the following components request very similar data, but they're not identical:

```js
// components/ProductTitle.server.jsx

const QUERY = `
  query ProductTitle {
    product(handle: "shoes") {
      title
    }
  }
`;

export default function ProductTitle() {
  const {data} = useShopQuery({query: QUERY});

  return <h1>{data.product.title}</h1>;
}
```



```js
// components/ProductVendor.server.jsx

const QUERY = `
  query ProductVendor {
    product(handle: "shoes") {
      vendor
    }
  }
`;

export default function ProductVendor() {
  const {data} = useShopQuery({query: QUERY});

  return <div className="vendor">{data.product.vendor}</div>;
}
```



If you combine the above two queries, then Hydrogen only makes a single call to the Storefront API, and your components can read from the same response:

```js
// components/ProductTitle.server.jsx

export const PRODUCT_QUERY = `
  query ProductInfo {
    product(handle: "shoes") {
      title
      vendor
    }
  }
`;

export default function ProductTitle() {
  const {data} = useShopQuery({query: PRODUCT_QUERY});

  return <h1>{data.product.title}</h1>;
}
```



```js
// components/ProductVendor.server.jsx

import {PRODUCT_QUERY} from './ProductTitle.server';

export default function ProductVendor() {
  const {data} = useShopQuery({query: PRODUCT_QUERY});

  return <div className="vendor">{data.product.vendor}</div>;
}
```




### Use a preload cache

Hydrogen offers a [preload cache](/tutorials/querying/preloaded-queries/) that you should enable for non-personalized data resources. This allows Hydrogen to start loading all of the required resources for a given page immediately, rather than after the entire app tree has been resolved and rendered.

```tsx
// components/Marketing.server.jsx

const data = fetchSync('https://my.api.com/static-data.json', {
  preload: true,
}).json();
```



## Server bundle size

When you deploy your Hydrogen storefront on a Workers runtime like Oxygen or Cloudflare Workers, it's important to maintain a small server bundle size. This is because each serverless invocation becomes slower as the size of the code grows larger.

Some client-only dependencies like [`threejs`](https://threejs.org/) might be larger than 500KB when bundled on the server. You can reduce the server bundle size by preventing these dependencies from being included in the bundle.

Hydrogen provides a `import.meta.env.SSR` object to allow you to tree-shake these dependencies from your server bundle:


```js
// components/Product.client.jsx

import {lazy} from 'react';

/**
 * Provide a consistent fallback to prevent hydration mismatch errors.
 */
const BoxFallback = () => '...';

/**
 * If server-side rendering, then return the fallback instead of the heavy dependency.
 */
const Box = import.meta.env.SSR
  ? BoxFallback
  : lazy(() => import('./Box.client'));

export default function Product() {
  return (
    <Suspense fallback={<BoxFallback />}>
      <Box />
    </Suspense>
  );
}
```



> Note:
> This method only works when importing client components from existing client components. You can't use this method inside server components.

## Next steps

- Learn about [best practices for making your Hydrogen custom storefront accessible](/tutorials/best-practices/accessibility/).
