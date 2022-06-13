---
gid: c850ae3e-fafd-11eb-9a03-0242ac130008
title: useShopQuery
description: The useShopQuery hook allows you to make server-only GraphQL queries to the Storefront API.
---

The `useShopQuery` hook allows you to make server-only GraphQL queries to the Storefront API. It must be a descendent of a `ShopifyProvider` component.

## Example code

```tsx
import {useShopQuery, gql} from '@shopify/hydrogen';

export default function Blog() {
  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      handle: 'frontpage',
    },
  });

  return <h1>{data.blog.articles.edges[0].node.title}</h1>;
}

const QUERY = gql`
  fragment ArticleDetails on Article {
    id
    title
    body: contentHtml
  }

  fragment BlogDetails on Blog {
    articles(first: 1) {
      edges {
        node {
          ...ArticleDetails
        }
      }
    }
  }

  query blogContent($handle: String!) {
    blog: blogByHandle(handle: $handle) {
      ...BlogDetails
    }
  }
`;
```

## Arguments

The `useShopQuery` takes an object as its only argument, with the following keys:

| Key         | Required | Description                                                                                                                                                                                                                                                         |
| ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query`     | Yes      | A string of the GraphQL query.                                                                                                                                                                                                                                      |
| `variables` | No       | An object of the variables for the GraphQL query.                                                                                                                                                                                                                   |
| `cache`     | No       | The [caching strategy](https://shopify.dev/custom-storefronts/hydrogen/framework/cache#caching-strategies) to help you determine which cache control header to set.                                                                                                 |
| `preload`   | No       | Whether to [preload the request](https://shopify.dev/custom-storefronts/hydrogen/framework/preloaded-queries). It defaults to true only when the `CachingStrategy` is not `CacheNone`. Specify `false` to disable or use `'*'` to preload the query for all requests. |

## Return value

The `useShopQuery` returns an object with the following key:

| Key    | Description                     |
| ------ | ------------------------------- |
| `data` | The data returned by the query. |

## Related components

- [`ShopifyProvider`](https://shopify.dev/api/hydrogen/components/global/shopifyprovider)

## Related hooks

- [`fetchSync`](https://shopify.dev/api/hydrogen/hooks/global/fetchsync)
- [`useQuery`](https://shopify.dev/api/hydrogen/hooks/global/usequery)

## Related framework topics

- [Caching](https://shopify.dev/custom-storefronts/hydrogen/framework/cache)
- [Preloaded queries](https://shopify.dev/custom-storefronts/hydrogen/framework/preloaded-queries)
- [Routes](https://shopify.dev/custom-storefronts/hydrogen/framework/routes)
- [Working with React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/work-with-rsc)
