# useShopQuery


The `useShopQuery` hook allows you to make server-only GraphQL queries to the Storefront API. It must be a descendent of a `ShopifyProvider` component.

> Note:
> `queryShop` is the `API` route version of `useShopQuery`. Use [`queryShop`](/utilities/queryshop/) to query the Storefront API within `API` routes.

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
| `cache`     | No       | The [caching strategy](https://shopify.dev/custom-storefronts/hydrogen/querying/cache#caching-strategies) to help you determine which cache control header to set.                                                                                                 |
| `preload`   | No       | Whether to [preload the request](https://shopify.dev/custom-storefronts/hydrogen/querying/preloaded-queries). It defaults to true only when the `CachingStrategy` is not `CacheNone`. Specify `false` to disable or use `'*'` to preload the query for all requests. |

## Return value

The `useShopQuery` returns an object with the following key:

| Key    | Description                     |
| ------ | ------------------------------- |
| `data` | The data returned by the query. |

## Related components

- [`ShopifyProvider`](/components/global/shopifyprovider/)

## Related utilities

- [`queryShop`](/utilities/queryshop/)

## Related hooks

- [`fetchSync`](/hooks/global/fetchsync/)
- [`useQuery`](/hooks/global/usequery/)

## Related framework topics

- [Caching](https://shopify.dev/custom-storefronts/hydrogen/querying/cache)
- [Preloaded queries](https://shopify.dev/custom-storefronts/hydrogen/querying/preloaded-queries)
- [Routes](https://shopify.dev/custom-storefronts/hydrogen/routing)
- [Working with React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components/work-with-rsc)
