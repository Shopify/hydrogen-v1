---
gid: 3c683d29-6b1d-4896-9b9e-3b43e4246870
title: Fetch data in Hydrogen
description: Learn how to query, fetch, and mutate data in your Hydrogen storefront, and how to call third-party APIs
feature_flag: hydrogen2
---

> ⚠️ **Important:** [Hydrogen 2.0](https://hydrogen.shopify.dev) is out now. These archival docs are provided only to assist developers during their upgrade process. Please migrate to Hydrogen 2.0 as soon as possible.


Write a brief summary of the how-to guide that includes:

- the goal of the how-to guide
- the significance/benefit of the goal
- the intended audience

> Note:
> For localization, the Storefront API accepts an [`@inContext` directive](/custom-storefronts/internationalization/international-pricing) to support international pricing. While you can pass variables directly when you call `storefront.query`, you can also inject the `language` and `country` variables automatically using the `i18n` feature. For more information, refer to <mark>INSERT LINK TO INTERNATIONALIZATION DOC</mark>

## Requirements

<mark>Completing the getting started might be required for this work. If so, indicate it. Add any other requirements too.</mark>

- Requirement 1 (for example, Your app can make [authenticated requests](/api/admin/getting-started) to the GraphQL Admin API.)
- Requirement 2 (for example, Your app has the `write_order` [access scope](/api/usage/access-scopes). For more information on requesting access scopes when your app is installed, refer to [Getting started with OAuth](/apps/auth/oauth/getting-started).)

## Step 1: Load data and query the Storefront API

<mark>Tell the user what they will do, why they will do it, and how it benefits them. If needed, provide additional information about the task, such as what might have led them to do this task if it's part of a bigger set of tasks.</mark>

<mark>link out to Remix framework docs where relevant. For example, here you can link to `loader`</mark>

To load data into your Hydrogen app, you'll use a Remix `loader` and write a GraphQL query. Hydrogen provides a special storefront param to make queries against your Shopify storefront. The following is an example:

{% codeblock file, filename: 'INSERT FILEPATH HERE' %}

```tsx
import type {ProductType} from '@shopify/storefront-kit-react/storefront-api-types';
import {json, useLoaderData, type LoaderArgs} from '@shopify/hydrogen-remix';
import invariant from 'tiny-invariant';

export async function loader({params, context: {storefront}}: LoaderArgs) {
  const productQuery = storefront.query<ProductType>(
    `#graphql
      query Product($handle: String!) {
        product(handle: $handle) {
          id
          title
        }
      }
    `,
    {
      /**
       * Pass variables related to the query.
       */
      variables: {
        handle: params.handle,
      },
      /**
       * Optionally filter your data before it is returned from the loader.
       */
      filter(data, errors) {
        invariant(data.product, 'No product found');

        return data.product;
      },
      /**
       * Cache your server-side query with a built-in best practice default (SWR).
       */
      cache: storefront.CacheShort(),
    },
  );

  return json({
    product: await productQuery,
  });
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();

  // ...
}
```

{% endcodeblock %}

## Step 2: (Optional) Prioritize critical data

<mark>Don't overload the user with information here, but consider some implementation details that will help them understand the code, or, better yet, make comments in code so that the user can see the explanation of what the code is doing in proximity to the code.</mark>

Sometimes, you will want to prioritize critical data, like product information, while deferring comments or reviews. The following is an example:

{% codeblock file, filename: 'INSERT FILEPATH HERE' %}

```tsx
import {defer, type LoaderArgs} from '@shopify/hydrogen-remix';

export async function loader({params, context: {storefront}}: LoaderArgs) {
  const productQuery = storefront.query(
    `#graphql
      query Product($handle: String!) {
        product(handle: $handle) {
          id
          title
        }
      }
    `,
    {
      variables: {
        handle: params.handle,
      },
    },
  );

  const reviewsQuery = storefront.query(
    `#graphql
      query ProductReviews($handle: String!) {
        productReviews(handle: $handle) {
          nodes {
            description
          }
        }
      }
    `,
    {
      variables: {
        handle: params.handle,
      },
      filter(data, errors) {
        invariant(data.productReviews, 'No product found');

        return data.productReviews;
      },
    },
  );

  return defer({
    product: await productQuery,
    reviews: reviewsQuery,
  });
}
```

{% endcodeblock %}

### Cache data

You can cache data that isn't frequently updated to speed up subsequent queries. Hydrogen supports caching at the sub-request level. The following is an example:

{% codeblock file, filename: 'INSERT FILEPATH HERE' %}

```tsx
import {defer, type LoaderArgs} from '@shopify/hydrogen-remix';

export async function loader({params, context: {storefront}}: LoaderArgs) {
  const productQuery = storefront.query(
    `#graphql
      query Product($handle: String!) {
        product(handle: $handle) {
          id
          title
        }
      }
    `,
    {
      variables: {
        handle: params.handle,
      },
      cache: storefront.CacheShort(),
    },
  );

  const reviewsQuery = storefront.query(
    `#graphql
      query ProductReviews($handle: String!) {
        productReviews(handle: $handle) {
          nodes {
            description
          }
        }
      }
    `,
    {
      variables: {
        handle: params.handle,
      },
    },
  );

  return defer(
    {
      product: await productQuery,
      reviews: reviewsQuery,
    },
    {
      // TODO: Do we want full-page cache?
      // See implications on caching errored defer data, etc
      headers: {
        'Cache-Control': 'max-age=1; stale-while-revalidate=9',
      },
    },
  );
}
```

{% endcodeblock %}

## Step 3: Mutate data

To mutate data in actions, use the `storefront.mutate` function. This is just like the `query` property, except caching is disabled:

{% codeblock file, filename: 'INSERT FILEPATH HERE' %}

```ts
export async function action({request, context: {storefront}}) {
  const formData = await request.formData();

  const cartMutation = storefront.mutate(
    `#graphql
      mutation lineItemUpdate($lineId: ID!, $input: CartLineUpdateInput!) {
          lineItemUpdate(lineId: $lineId, input: $input) {
            quantity
          }
      }
    `,
    {
      /**
       * Pass variables related to the query.
       */
      variables: {
        lineId: formData.get('lineId'),
        input: formData.get('input'),
      },
      /**
       * Mutations are NEVER cached by default.
       */
    },
  );

  return json({
    status: 'ok',
  });
}
```

{% endcodeblock %}

## Step 4: (Optional) Query third-party APIs

<mark>Link out to any docs where we talk about `context.fetch` and `fetch`, if you think Partners will not know what this is and will want to learn.</mark>

Hydrogen implements clever cache strategies for querying the Storefront API. However, the same feature can be used for third-party APIs by using `context.fetch` instead of the global `fetch`. The following is an example:

{% codeblock file, filename: 'INSERT FILEPATH HERE' %}

```ts
export async function loader({
  params,
  context: {fetch, storefront},
}: LoaderArgs) {
  const [body, response] = await fetch('https://third-party-api.com/resource', {
    method: 'GET',
    headers: {
      /*...*/
    },
    hydrogen: {
      /**
       * Cache your third-party API request in the server.
       */
      cache: storefront.CacheLong(),
      /**
       * [Optional] Check the response body to optionally avoid caching. Useful for GraphQL logical errors.
       */
      shouldCacheResponse: (body) => !body.errors,
    },
  });
}
```

{% endcodeblock %}
