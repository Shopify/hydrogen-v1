<!-- This file is generated from the source code. Edit the files in /packages/hydrogen/src/hooks/useShopQuery and run 'yarn generate-docs' at the root of this repo. -->

The `useShopQuery` hook allows you to make server-only GraphQL queries to the Storefront API. The `useShop` hook provides access to values within `shopify.config.js`. It must be a descendent of a `ShopifyProvider` component. 

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

| Key         | Required | Description                                       |
| ----------- | -------- | ------------------------------------------------- |
| `query`     | Yes      | A string of the GraphQL query.                    |
| `variables` | No       | An object of the variables for the GraphQL query. |

## Return value

The `useShopQuery` returns an object with the following keys:

| Key    | Description                     |
| ------ | ------------------------------- |
| `data` | The data returned by the query. |

## Related components

- [`ShopifyProvider`](/api/hydrogen/components/global/shopifyprovider)
