# Fetch storefront data


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



Previously, you [began developing a Hydrogen storefront](/tutorials/getting-started/tutorial/begin/). You have a minimal Hydrogen storefront running locally. You’re now ready to fetch data from your storefront.

In this tutorial, you'll connect your Hydrogen app to your storefront and fetch data using the [Storefront API](https://shopify.dev/api/storefront).

## Scenario

You want to retrieve specific data from your storefront, including your store’s name and collections. You know that you'll use the Storefront API, which allows you to build custom shopping experiences. The Storefront API makes it possible for customers to view products and collections, add products to a cart, and check out.

## What you’ll learn

In this tutorial, you’ll learn how to do the following tasks:

- Make a GraphQL query using the [Shopify Storefront API GraphiQL explorer](https://shopify.dev/docs/custom-storefronts/tools/graphiql-storefront-api).
- Implement the [useShopQuery](/hooks/global/useshopquery/) hook to fetch storefront data from inside your Hydrogen app.
- Generate default SEO tags.
- Improve the loading sequence of your app using Suspense.

![A collections page, GraphQL query, and SEO tags](https://shopify.dev/assets/custom-storefronts/hydrogen/hydrogen-fetch-data.png)

## Requirements

- You’ve completed the [Begin developing a Hydrogen storefront](/tutorials/getting-started/tutorial/begin/) tutorial.

## Sample code

If you want to quickly get started, then you can copy and paste the following code from each file into the corresponding files in your Hydrogen app. If the file doesn’t yet exist, then you can create it in your Hydrogen app. This tutorial describes the sample code step by step:

```jsx
// /src/routes/index.server.jsx

import { Suspense } from "react";

import FeaturedCollections from "../components/FeaturedCollections.server";
import { Layout } from "../components/Layout.server";

export default function Home() {
  return (
    <Layout>
      <Suspense>
        <FeaturedCollections />
      </Suspense>
    </Layout>
  );
}
```

```javascript?filename: '/src/App.server.jsx', title: 'App'
import React from 'react';
import renderHydrogen from '@shopify/hydrogen/entry-server';
import {
  Router,
  FileRoutes,
  ShopifyProvider,
} from '@shopify/hydrogen';
import {Suspense} from 'react';

function App() {
  return (
    <Suspense fallback={null}>
      <ShopifyProvider>
          <Router>
            <FileRoutes />
          </Router>
      </ShopifyProvider>
    </Suspense>
  );
}

export default renderHydrogen(App);
```

```javascript?filename: '/src/components/Layout.server.jsx', title: 'Layout'

import {
  useShopQuery,
  CacheLong,
  gql,
  useUrl,
  Link,
  Seo,
} from "@shopify/hydrogen";
import { Suspense } from "react";

/**
 * A server component that defines a structure and organization of a page that can be used in different parts of the Hydrogen app
 */
export function Layout({ children }) {
  const { pathname } = useUrl();
  const isHome = pathname === "/";

  const {
    data: { shop },
  } = useShopQuery({
    query: SHOP_QUERY,
    cache: CacheLong(),
    preload: true,
  });

  return (
    <>
      <Suspense>
        <Seo
          type="defaultSeo"
          data={{
            title: shop.name,
            description: shop.description,
          }}
        />
      </Suspense>
      <div className="flex flex-col min-h-screen antialiased bg-neutral-50">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        <header
          role="banner"
          className={`flex items-center h-16 p-6 md:p-8 lg:p-12 sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 antialiased transition shadow-sm ${
            isHome ? "bg-black/80 text-white" : "bg-white/80"
          }`}
        >
          <div className="flex gap-12">
            <Link className="font-bold" to="/">
              {shop.name}
            </Link>
          </div>
        </header>

        <main role="main" id="mainContent" className="flex-grow">
          <Suspense>{children}</Suspense>
        </main>
      </div>
    </>
  );
}

const SHOP_QUERY = gql`
  query ShopInfo {
    shop {
      name
      description
    }
  }
`;

```

```javascript?filename: '/src/components/FeaturedCollections.server.jsx', title: 'FeaturedCollections'
import { Link, Image, gql, useShopQuery, CacheLong } from "@shopify/hydrogen";

export default function FeaturedCollections() {
  const {
    data: { collections },
  } = useShopQuery({
    query: QUERY,
    cache: CacheLong(),
  });

  return (
    <section className="w-full gap-4 md:gap-8 grid p-6 md:p-8 lg:p-12">
      <h2 className="whitespace-pre-wrap max-w-prose font-bold text-lead">
        Collections
      </h2>
      <div className="grid-flow-row grid gap-2 gap-y-6 md:gap-4 lg:gap-6 grid-cols-1 false  sm:grid-cols-3 false false">
        {collections.nodes.map((collection) => {
          return (
            <Link key={collection.id} to={`/collections/${collection.handle}`}>
              <div className="grid gap-4">
                {collection?.image && (
                  <Image
                    className="rounded shadow-border overflow-clip inline-block aspect-[5/4] md:aspect-[3/2] object-cover"
                    width={"100%"}
                    height={336}
                    alt={`Image of ${collection.title}`}
                    data={collection.image}
                  />
                )}
                <h2 className="whitespace-pre-wrap max-w-prose font-medium text-copy">
                  {collection.title}
                </h2>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

const QUERY = gql`
  query FeaturedCollections {
    collections(first: 3, query: "collection_type:smart", sortKey: UPDATED_AT) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
  }
`;
```



## Step 1: Visit the GraphiQL explorer

> Note:
> By default, your Hydrogen app is connected to a Demo Store and uses a demo Storefront API access token. For the purposes of this tutorial, you'll use the Demo Store configuration. After you've finished this tutorial series, you can create a new Hydrogen app and [connect it to your own storefront](/tutorials/configuration/).

You can explore the [Storefront API](https://shopify.dev/api/storefront) and run test queries in your Hydrogen app. When you're running the Hydrogen local development server, you can load an interactive GraphiQL explorer that's connected to your shop.

1. With your development server running, visit the GraphiQL explorer at one of the following URLs:
    - http://localhost:3000/graphql
    - http://localhost:3000/___graphql

1. Run the following query in the GraphiQL explorer:

    ```graphql
    query ShopInfo {
      shop {
        name
        description
      }
    }
    ```



    ![GraphQL query run in the GraphiQL explorer](https://shopify.dev/assets/custom-storefronts/hydrogen/graphql-query.png)

## Step 2: Move the query into your Hydrogen app

Now that you’ve tested your query in the GraphiQL explorer and verified that it works, you can move the query into your Hydrogen app to display the shop name.

Hydrogen offers the [`useShopQuery`](/hooks/global/useshopquery/) hook to fetch data from your storefront from within [server components](/tutorials/react-server-components/index.md#component-types). In this step, you'll create a new `Layout` component that renders your shop name, and you'll use the `useShopQuery` hook within `Layout` to pass in a GraphQL query that retrieves your shop's name.

> Tip:
> Hydrogen contains a set of Shopify-specific commerce components, hooks, and utilities that help accelerate your development process. You can refer to the [Hydrogen reference](https://shopify.dev/docs/api/hydrogen) to determine which fields need to be queried for each component.

### Create a `Layout` component

Hydrogen is modelled after [React Server Components](/tutorials/react-server-components/), an approach that offers an opinionated data-fetching and rendering workflow for React apps. It includes server, client, and shared component types.

The first [server component](/tutorials/react-server-components/index.md#component-types) that you’ll build is a layout component. The layout component will be a server component because it doesn't require any client-side interactivity. Server components end in `.server.jsx`.

1. Create a new server component named `Layout.server.jsx` and move your GraphQL query to the `useShopQuery` hook:

```jsx
// /src/components/Layout.server.jsx

import { useShopQuery, CacheLong, gql, useUrl, Link } from "@shopify/hydrogen";

/**
 * A server component that defines a structure and organization of a page that can be used in different parts of the Hydrogen app
*/
export function Layout({ children }) {
  const { pathname } = useUrl();
  const isHome = pathname === "/";

  const {
    data: { shop },
  } = useShopQuery({
    query: SHOP_QUERY,
    cache: CacheLong(),
    preload: true,
  });

  return (
    <>
      <div className="flex flex-col min-h-screen antialiased bg-neutral-50">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        <header
          role="banner"
          className={`flex items-center h-16 p-6 md:p-8 lg:p-12 sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 antialiased transition shadow-sm ${
            isHome ? "bg-black/80 text-white" : "bg-white/80"
          }`}
        >
          <div className="flex gap-12">
            <Link className="font-bold" to="/">
              {shop.name}
            </Link>
          </div>
        </header>

        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
      </div>
    </>
  );
}

const SHOP_QUERY = gql`
  query ShopInfo {
    shop {
      name
      description
    }
  }
`;
```



1. Import the `Layout` component into the home page of your storefront and update the home page:

```jsx
// /src/routes/index.server.jsx

import { Layout } from "../components/Layout.server";

export default function Home() {
  return (
    <Layout>
      <div className="p-6 md:p-8 lg:p-12">
        <h1 className="font-extrabold mb-4 text-5xl md:text-7xl">
          Hello world!
        </h1>
        <p className="font-bold mb-3">Welcome to Hydrogen.</p>
        <p>
          Hydrogen is a front-end web development framework used for building
          Shopify custom storefronts.
        </p>
      </div>
    </Layout>
  );
}
```



The home page renders the name of your shop and a **Hello world!** message:

![Home page with name of shop and Hello world messaged rendered](https://shopify.dev/assets/custom-storefronts/hydrogen/shop-name-hello-world.png)

## Step 3: Generate SEO tags

Hydrogen includes an [Seo](/components/primitive/seo/) client component that renders SEO information on a webpage. The `Seo` client component uses the data from Storefront API to generate the `<head>` tags that search engines look for.

To generate SEO tags for search engines, add an [`Seo`](/components/primitive/seo/) component to your layout, and pass the shop `title` and `description` to the `data` prop:

```jsx
// /src/components/Layout.server.jsx


import {
  useShopQuery,
  CacheLong,
  gql,
  useUrl,
  Link,
  Seo,
} from "@shopify/hydrogen";

/**
 * A server component that defines a structure and organization of a page that can be used in different parts of the Hydrogen app
 */
export function Layout({ children }) {
  const { pathname } = useUrl();
  const isHome = pathname === "/";

  const {
    data: { shop },
  } = useShopQuery({
    query: SHOP_QUERY,
    cache: CacheLong(),
    preload: true,
  });

  return (
    <>
      <Seo
        type="defaultSeo"
        data={{
          title: shop.name,
          description: shop.description,
        }}
      />
      <div className="flex flex-col min-h-screen antialiased bg-neutral-50">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        <header
          role="banner"
          className={`flex items-center h-16 p-6 md:p-8 lg:p-12 sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 antialiased transition shadow-sm ${
            isHome ? "bg-black/80 text-white" : "bg-white/80"
          }`}
        >
          <div className="flex gap-12">
            <Link className="font-bold" to="/">
              {shop.name}
            </Link>
          </div>
        </header>

        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
      </div>
    </>
  );
}

const SHOP_QUERY = gql`
  query ShopInfo {
    shop {
      name
      description
    }
  }
`;

```



If you inspect the page, then you can find the SEO tags that have been added into the `<head>` tag:

![SEO tags that have been added into the head tag](https://shopify.dev/assets/custom-storefronts/hydrogen/seo-tags.png)

## Step 4: Fetch collections

Collections make it easier for customers to find products by category. For example, you might have a collection that features a subset of products.

### Create a `FeaturedCollections` component

To list some collections on the home page, you’ll create a `FeaturedCollections` component. This component will query for the first three collections on your storefront.

1. Create a new server component called `FeaturedCollections.server.jsx`. Add the [useShopQuery](/hooks/global/useshopquery/) hook to your component so that you can query the Storefront API:

> Tip:
> In the following code sample, you’ll notice a reference to a [`Link`](/components/framework/link/) component. The `Link` component is used to navigate between routes. Because it renders an underlying `<a>` element, all properties available to the `<a>` element are also available to the `Link` component.

```jsx
// /src/components/FeaturedCollections.server.jsx

import { Link, Image, gql, useShopQuery, CacheLong } from "@shopify/hydrogen";

export default function FeaturedCollections() {
  const {
    data: { collections },
  } = useShopQuery({
    query: QUERY,
    cache: CacheLong(),
  });

  return (
    <section className="w-full gap-4 md:gap-8 grid p-6 md:p-8 lg:p-12">
      <h2 className="whitespace-pre-wrap max-w-prose font-bold text-lead">
        Collections
      </h2>
      <div className="grid-flow-row grid gap-2 gap-y-6 md:gap-4 lg:gap-6 grid-cols-1 false  sm:grid-cols-3 false false">
        {collections.nodes.map((collection) => {
          return (
            <Link key={collection.id} to={`/collections/${collection.handle}`}>
              <div className="grid gap-4">
                <h2 className="whitespace-pre-wrap max-w-prose font-medium text-copy">
                  {collection.title}
                </h2>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

const QUERY = gql`
  query FeaturedCollections {
    collections(first: 3, query: "collection_type:smart", sortKey: UPDATED_AT) {
      nodes {
        id
        title
        handle
      }
    }
  }
`;
```



1. Import the `FeaturedCollections` component into the home page of your storefront:

```jsx
// /src/routes/index.server.jsx

import FeaturedCollections from "../components/FeaturedCollections.server";
import { Layout } from "../components/Layout.server";

export default function Home() {
  return (
    <Layout>
      <FeaturedCollections />
    </Layout>
  );
}
```



The home page renders the following featured collections section:

![A featured collections section that contains three collections](https://shopify.dev/assets/custom-storefronts/hydrogen/three-collections.png)

### Fetch collection images

Next, you'll fetch the image associated with each collection.

In `FeaturedCollections.server.jsx`, update your GraphQL query to retrieve collection images and use an `Image` component to display the image:

> Tip:
> In the following code sample, you’ll notice a reference to an [`Image`] (/docs/components/primitive/image) component. The `Image` component renders an image for the Storefront API's [Image object](https://shopify.dev/api/storefront/latest/objects/image) by using the `data` prop, or a custom location by using the `src` prop.

```jsx
// /src/components/FeaturedCollections.server.jsx

import { Link, Image, gql, useShopQuery, CacheLong } from "@shopify/hydrogen";

export default function FeaturedCollections() {
  const {
    data: { collections },
  } = useShopQuery({
    query: QUERY,
    cache: CacheLong(),
  });

  return (
    <section className="w-full gap-4 md:gap-8 grid p-6 md:p-8 lg:p-12">
      <h2 className="whitespace-pre-wrap max-w-prose font-bold text-lead">
        Collections
      </h2>
      <div className="grid-flow-row grid gap-2 gap-y-6 md:gap-4 lg:gap-6 grid-cols-1 false  sm:grid-cols-3 false false">
        {collections.nodes.map((collection) => {
          return (
            <Link key={collection.id} to={`/collections/${collection.handle}`}>
              <div className="grid gap-4">
                {collection?.image && (
                  <Image
                    className="rounded shadow-border overflow-clip inline-block aspect-[5/4] md:aspect-[3/2] object-cover"
                    width={"100%"}
                    height={336}
                    alt={`Image of ${collection.title}`}
                    data={collection.image}
                  />
                )}
                <h2 className="whitespace-pre-wrap max-w-prose font-medium text-copy">
                  {collection.title}
                </h2>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

const QUERY = gql`
  query FeaturedCollections {
    collections(first: 3, query: "collection_type:smart", sortKey: UPDATED_AT) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
  }
`;
```



The home page renders the following featured collections section that contains the images of the first three collections:

![A featured collections section that contains the images of the first three collections](https://shopify.dev/assets/custom-storefronts/hydrogen/collection-images.png)

## Step 5: Improve the loading sequence with Suspense

[Suspense](/tutorials/streaming-ssr/) is a feature of React that governs the appearance and behavior of placeholder content inside components while asynchronous data-fetching is in progress. React 18 introduced [Suspense for data fetching to complement streaming SSR](https://nextjs.org/docs/advanced-features/react-18/streaming). Learn more about [how to use Suspense](/tutorials/best-practices/performance.md#suspense-boundaries).

`FeaturedCollections` is a server component that fetches data from the Storefront API. Until the component finishes loading, React looks for the closest `Suspense` boundary to display the specified loading fallback.

Currently, the closest Suspense ancestor wraps the entire app in `App.server.jsx`. By wrapping `FeaturedCollections` in its own Suspense boundary, it won't block other components on the page.

1. Wrap the `FeaturedCollections` component in a Suspense component:

```jsx
// /src/routes/index.server.jsx

import { Suspense } from "react";

import FeaturedCollections from "../components/FeaturedCollections.server";
import { Layout } from "../components/Layout.server";

export default function Home() {
  return (
    <Layout>
      <Suspense>
        <FeaturedCollections />
      </Suspense>
    </Layout>
  );
}
```



1. Similarly, update your Layout component to wrap `Seo` and `{ children }` in `Suspense` components:

```jsx
// /src/components/Layout.server.jsx


import {
  useShopQuery,
  CacheLong,
  gql,
  useUrl,
  Link,
  Seo,
} from "@shopify/hydrogen";
import { Suspense } from "react";

/**
 * A server component that defines a structure and organization of a page that can be used in different parts of the Hydrogen app
 */
export function Layout({ children }) {
  const { pathname } = useUrl();
  const isHome = pathname === "/";

  const {
    data: { shop },
  } = useShopQuery({
    query: SHOP_QUERY,
    cache: CacheLong(),
  });

  return (
    <>
      <Suspense>
        <Seo
          type="defaultSeo"
          data={{
            title: shop.name,
            description: shop.description,
          }}
        />
      </Suspense>
      <div className="flex flex-col min-h-screen antialiased bg-neutral-50">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        <header
          role="banner"
          className={`flex items-center h-16 p-6 md:p-8 lg:p-12 sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 antialiased transition shadow-sm ${
            isHome ? "bg-black/80 text-white" : "bg-white/80"
          }`}
        >
          <div className="flex gap-12">
            <Link className="font-bold" to="/">
              {shop.name}
            </Link>
          </div>
        </header>

        <main role="main" id="mainContent" className="flex-grow">
          <Suspense>{children}</Suspense>
        </main>
      </div>
    </>
  );
}

const SHOP_QUERY = gql`
  query ShopInfo {
    shop {
      name
      description
    }
  }
`;

```



## Next steps

- Learn how to [build a collection page](custom-storefronts/hydrogen/getting-started/tutorial/collections).
