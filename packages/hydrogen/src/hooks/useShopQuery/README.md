<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/hooks/useShopQuery and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/reference-docs/hydrogen.md. -->

The `useShopQuery` hook allows you to make server-only GraphQL queries to the Storefront API. It must be a descendent of a `ShopifyProvider` component.

## Example code

```tsx
import {useShopQuery} from '@shopify/hydrogen';
import gql from 'graphql-tag';

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

| Key              | Required | Description                                                                                                                                                                                                    |
| ---------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query`          | Yes      | A string of the GraphQL query.                                                                                                                                                                                 |
| `variables`      | No       | An object of the variables for the GraphQL query.                                                                                                                                                              |
| `cache`          | No       | The [caching strategy](/custom-storefronts/hydrogen/framework/cache#caching-strategies) to help you determine which cache control header to set.                                                               |
| `preload`        | No       | Whether to [preload the query](/custom-storefronts/hydrogen/framework/preloaded-queries). Defaults to `false`. Specify `true` to preload the query for the URL or `'*'` to preload the query for all requests. |
| `trackOverfetch` | No       | Whether to detect and display a warning in your app if you're over-fetching data from the Storefront API.                                                                                                      |

## Return value

The `useShopQuery` returns an object with the following key:

| Key    | Description                     |
| ------ | ------------------------------- |
| `data` | The data returned by the query. |

## Related components

- [`ShopifyProvider`](/api/hydrogen/components/global/shopifyprovider)

## Related hooks

- [`useQuery`](/api/hydrogen/hooks/global/usequery)
