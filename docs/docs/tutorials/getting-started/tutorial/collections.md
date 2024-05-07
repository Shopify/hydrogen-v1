# Build a collection page


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



Previously, you [fetched data from your storefront](/tutorials/getting-started/tutorial/fetch-data/), including your store’s name and collections. Your home page is rendering a featured collections section. You’re now ready to build a collection page.

In this tutorial, you'll build a page that renders a collection and products that belong to the collection.

## Scenario

You want to present a grouping of products on your storefront. For example, you might have a collection for a specific type of product that you sell, such as snowboards. Collections help you organize your products and make it easier for customers to browse your store.

## What you’ll learn

In this tutorial, you’ll learn how to do the following tasks:

- Create a collections route to familiarize yourself with Hydrogen’s file-based routing system.
- Query collections by their handle.
- Generate SEO tags for collection pages.
- Implement Shopify Analytics on collection pages.
- Fetch products that belong to a collection.

<video autoplay muted loop controls>
  <source src="https://shopify.dev/assets/custom-storefronts/hydrogen/build-a-collection-page.mp4" />
</video>

## Requirements

- You’ve completed [Fetch storefront data](/tutorials/getting-started/tutorial/fetch-data/).

## Sample code

If you want to quickly get started, then you can copy and paste the following code from each file into the corresponding files in your Hydrogen app. If the file doesn’t yet exist, then you can create it in your Hydrogen app. This tutorial describes the sample code step by step:

```jsx
// /src/routes/collections/[handle].server.jsx

import {
  gql,
  useShopQuery,
  useRouteParams,
  useServerAnalytics,
  ShopifyAnalyticsConstants,
  Seo,
} from "@shopify/hydrogen";

import { Layout } from "../../components/Layout.server";
import ProductCard from "../../components/ProductCard.server";
import { Suspense } from "react";

export default function Collection() {
  const { handle } = useRouteParams();

  const {
    data: { collection },
  } = useShopQuery({
    query: QUERY,
    variables: {
      handle,
    },
  });

  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.collection,
      resourceId: collection.id,
    },
  });

  return (
    <Layout>
      <Suspense>
        <Seo type="collection" data={collection} />
      </Suspense>
      <header className="grid w-full gap-8 p-4 py-8 md:p-8 lg:p-12 justify-items-start">
        <h1 className="text-4xl whitespace-pre-wrap font-bold inline-block">
          {collection.title}
        </h1>

        {collection.description && (
          <div className="flex items-baseline justify-between w-full">
            <div>
              <p className="max-w-md whitespace-pre-wrap inherit text-copy inline-block">
                {collection.description}
              </p>
            </div>
          </div>
        )}
      </header>

      <section className="w-full gap-4 md:gap-8 grid p-6 md:p-8 lg:p-12">
        <div className="grid-flow-row grid gap-2 gap-y-6 md:gap-4 lg:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {collection.products.nodes.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </Layout>
  );
}

const QUERY = gql`
  query CollectionDetails($handle: String!) {
    collection(handle: $handle) {
      id
      title
      description
      seo {
        description
        title
      }
      image {
        id
        url
        width
        height
        altText
      }
      products(first: 8) {
        nodes {
          id
          title
          publishedAt
          handle
          variants(first: 1) {
            nodes {
              id
              image {
                url
                altText
                width
                height
              }
              priceV2 {
                amount
                currencyCode
              }
              compareAtPriceV2 {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;
```

```javascript?filename: '/src/components/ProductCard.server.jsx', title: 'ProductCard'
import { Link, Image, Money } from "@shopify/hydrogen";

export default function ProductCard({ product }) {
  const { priceV2: price, compareAtPriceV2: compareAtPrice } =
    product.variants?.nodes[0] || {};

  const isDiscounted = compareAtPrice?.amount > price?.amount;

  return (
    <Link to={`/products/${product.handle}`}>
      <div className="grid gap-6">
        <div className="shadow-sm rounded relative">
          {isDiscounted && (
            <label className="subpixel-antialiased absolute top-0 right-0 m-4 text-right text-notice text-red-600 text-xs">
              Sale
            </label>
          )}
          <Image
            className="aspect-[4/5]"
            data={product.variants.nodes[0].image}
            alt="Alt Tag"
          />
        </div>
        <div className="grid gap-1">
          <h3 className="max-w-prose text-copy w-full overflow-hidden whitespace-nowrap text-ellipsis ">
            {product.title}
          </h3>
          <div className="flex gap-4">
            <span className="max-w-prose whitespace-pre-wrap inherit text-copy flex gap-4">
              <Money withoutTrailingZeros data={price} />
              {isDiscounted && (
                <Money
                  className="line-through opacity-50"
                  withoutTrailingZeros
                  data={compareAtPrice}
                />
              )}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
```



## Step 1: Create a collections route

All components added to the `src/routes` directory in your Hydrogen app are [registered as routes](/tutorials/routing/). Any filenames with brackets, like `[handle]`, are converted to a route parameter called `:handle`.

To begin building your collection page, create a file called `/src/routes/collections/[handle].server.jsx` to register a new collections route. Then, display the dynamic handle on the page within the layout component.

```jsx
// /src/routes/collections/[handle].server.jsx

import { useRouteParams } from "@shopify/hydrogen";

import { Layout } from "../../components/Layout.server";

export default function Collection() {
  const { handle } = useRouteParams();
  return (
    <Layout>
      <section className="p-6 md:p-8 lg:p-12">
        This will be the collection page for <strong>{handle}</strong>
      </section>
    </Layout>
  );
}
```



The collections route is registered. Clicking a featured collection from the home page takes you to a dynamic collection page:

![A dynamic collection page](https://shopify.dev/assets/custom-storefronts/hydrogen/dynamic-collection-page.png)

## Step 2: Query a collection by handle

You can use a collection’s handle to query a collection. A handle is a unique string that identifies a resource, such as a collection. If a handle isn't specified when a collection is created, then the handle is generated from the collection's original title, replacing any spaces with hyphens. For example, a collection that was created with the title **Freestyle collection** might have the handle **freestyle-collection**.

In `/src/routes/collections/[handle].server.jsx`, add a GraphQL query that retrieves a collection by its handle:

```jsx
// /src/routes/collections/[handle].server.jsx

import { gql, useShopQuery, useRouteParams } from "@shopify/hydrogen";

import { Layout } from "../../components/Layout.server";

export default function Collection() {
  const { handle } = useRouteParams();

  const {
    data: { collection },
  } = useShopQuery({
    query: QUERY,
    variables: {
      handle,
    },
  });

  return (
    <Layout>
      <section className="p-6 md:p-8 lg:p-12">
        This will be the collection page for <strong>{collection.title}</strong>
      </section>
    </Layout>
  );
}

// Add a Graphql query that retrieves a collection by its handle.
const QUERY = gql`
  query CollectionDetails($handle: String!) {
    collection(handle: $handle) {
      title
    }
  }
`;
```



The collection page renders the following dynamic content:

![Dynamic content on the collection page](https://shopify.dev/assets/custom-storefronts/hydrogen/dynamic-content-collections.png)

## Step 3: Generate SEO tags and implement Shopify Analytics

In [Step 4 of the previous tutorial](/tutorials/getting-started/tutorial/fetch-data.md#step-3-generate-seo-tags), you added an SEO component to your Layout component, which allowed you to generate a series of default SEO tags in the `<head>` tag. In this step, you'll generate SEO tags that are specific to the collections page.

You'll also implement [Shopify Analytics](/components/framework/shopifyanalytics/) to send commerce-related analytics to Shopify. By adding the `ShopifyAnalytics` component to your Hydrogen storefront, you can view key sales, orders, and online store visitor data from the [Analytics dashboard in your Shopify admin](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/overview-dashboard/).

```jsx
// /src/routes/collections/[handle].server.jsx

import {
  gql,
  useShopQuery,
  Seo,
  useServerAnalytics,
  useRouteParams,
  ShopifyAnalyticsConstants,
} from "@shopify/hydrogen";
import { Suspense } from "react";

import { Layout } from "../../components/Layout.server";

export default function Collection() {
  const { handle } = useRouteParams();

  const {
    data: { collection },
  } = useShopQuery({
    query: QUERY,
    variables: {
      handle,
    },
  });

  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.collection,
      resourceId: collection.id,
    },
  });

  return (
    <Layout>
      <Suspense>
        <Seo type="collection" data={collection} />
      </Suspense>
      <header className="grid w-full gap-8 p-4 py-8 md:p-8 lg:p-12 justify-items-start">
        <h1 className="text-4xl whitespace-pre-wrap font-bold inline-block">
          {collection.title}
        </h1>

        {collection.description && (
          <div className="flex items-baseline justify-between w-full">
            <div>
              <p className="max-w-md whitespace-pre-wrap inherit text-copy inline-block">
                {collection.description}
              </p>
            </div>
          </div>
        )}
      </header>
    </Layout>
  );
}

// The `Seo` component uses the collection's `seo` values, if specified. If not
// specified, then the component falls back to using the collection's `title` and `description`.
const QUERY = gql`
  query CollectionDetails($handle: String!) {
    collection(handle: $handle) {
      id
      title
      description
      seo {
        description
        title
      }
    }
  }
`;
```



If you inspect the dynamic collection page, then you can find the collection SEO tags that have been added into the `<head>` tag. The collection's title and description display on the page:

![The title and description of a collection](https://shopify.dev/assets/custom-storefronts/hydrogen/registered-collections-route.png)

## Step 4: Query products and variants

Products are the goods, digital downloads, services, and gift cards that a merchant sells. If a product has options, like size or color, then merchants can add a variant for each combination of options. For example, a snowboard might be available for purchase in blue and green. The blue snowboard and the green snowboard are variants.

> Tip:
> In the following code samples, you’ll notice a reference to a [`Money`](/components/primitive/money/) component. The `Money` component renders a string of the Storefront API's [MoneyV2 object](https://shopify.dev/api/storefront/reference/common-objects/moneyv2/) according to the `defaultLocale` in the [Hydrogen configuration file](/tutorials/configuration/).

1. Create a `ProductCard` component to display the title, price, and image of each product within the collection:

    ```jsx
    // /src/components/ProductCard.server.jsx

    import { Link, Image, Money } from "@shopify/hydrogen";

    export default function ProductCard({ product }) {
      const { priceV2: price, compareAtPriceV2: compareAtPrice } =
        product.variants?.nodes[0] || {};

      const isDiscounted = compareAtPrice?.amount > price?.amount;

      return (
        <Link to={`/products/${product.handle}`}>
          <div className="grid gap-6">
            <div className="shadow-sm rounded relative">
              {isDiscounted && (
                <label className="subpixel-antialiased absolute top-0 right-0 m-4 text-right text-notice text-red-600 text-xs">
                  Sale
                </label>
              )}
              <Image
                className="aspect-[4/5]"
                data={product.variants.nodes[0].image}
                alt="Alt Tag"
              />
            </div>
            <div className="grid gap-1">
              <h3 className="max-w-prose text-copy w-full overflow-hidden whitespace-nowrap text-ellipsis ">
                {product.title}
              </h3>
              <div className="flex gap-4">
                <span className="max-w-prose whitespace-pre-wrap inherit text-copy flex gap-4">
                  <Money withoutTrailingZeros data={price} />
                  {isDiscounted && (
                    <Money
                      className="line-through opacity-50"
                      withoutTrailingZeros
                      data={compareAtPrice}
                    />
                  )}
                </span>
              </div>
            </div>
          </div>
        </Link>
      );
    }
    ```



2. Update the collection GraphQL query to include retrieving products and variants that belong to the collection:

    ```jsx
    // /src/routes/collections/[handle].server.jsx

    import {
      gql,
      useShopQuery,
      useRouteParams,
      useServerAnalytics,
      ShopifyAnalyticsConstants,
      Seo,
    } from "@shopify/hydrogen";

    import { Layout } from "../../components/Layout.server";
    import ProductCard from "../../components/ProductCard.server";
    import { Suspense } from "react";

    export default function Collection() {
      const { handle } = useRouteParams();

      const {
        data: { collection },
      } = useShopQuery({
        query: QUERY,
        variables: {
          handle,
        },
      });

      useServerAnalytics({
        shopify: {
          pageType: ShopifyAnalyticsConstants.pageType.collection,
          resourceId: collection.id,
        },
      });

      return (
        <Layout>
          <Suspense>
            <Seo type="collection" data={collection} />
          </Suspense>
          <header className="grid w-full gap-8 p-4 py-8 md:p-8 lg:p-12 justify-items-start">
            <h1 className="text-4xl whitespace-pre-wrap font-bold inline-block">
              {collection.title}
            </h1>

            {collection.description && (
              <div className="flex items-baseline justify-between w-full">
                <div>
                  <p className="max-w-md whitespace-pre-wrap inherit text-copy inline-block">
                    {collection.description}
                  </p>
                </div>
              </div>
            )}
          </header>

          <section className="w-full gap-4 md:gap-8 grid p-6 md:p-8 lg:p-12">
            <div className="grid-flow-row grid gap-2 gap-y-6 md:gap-4 lg:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {collection.products.nodes.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </Layout>
      );
    }

    const QUERY = gql`
      query CollectionDetails($handle: String!) {
        collection(handle: $handle) {
          id
          title
          description
          seo {
            description
            title
          }
          image {
            id
            url
            width
            height
            altText
          }
          products(first: 8) {
            nodes {
              id
              title
              publishedAt
              handle
              variants(first: 1) {
                nodes {
                  id
                  image {
                    url
                    altText
                    width
                    height
                  }
                  priceV2 {
                    amount
                    currencyCode
                  }
                  compareAtPriceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    `;
    ```



    The page renders the following products that belong to the collection:

    <video autoplay muted loop controls>
      <source src="https://shopify.dev/assets/custom-storefronts/hydrogen/build-a-collection-page.mp4" />
    </video>

## Next steps

- Learn how to [build a product page](/tutorials/getting-started/tutorial/products/).
