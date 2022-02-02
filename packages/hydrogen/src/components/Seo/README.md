<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/components/Seo and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `Seo` component renders SEO information on a webpage.

## Example code

```tsx
import {Seo, useShopQuery} from '@shopify/hydrogen';
import gql from 'graphql-tag';

const QUERY = gql`
  query PageDetails($handle: String!) {
    page(handle: $handle) {
      title
      body
      seo {
        title
        description
      }
    }
  }
`;

export default function Page({params}) {
  const {handle} = params;
  const {data} = useShopQuery({query: QUERY, variables: {handle}});

  if (!data.pageByHandle) {
    return <NotFound />;
  }

  const page = data.pageByHandle;

  return <Seo type="page" data={page} />;
}
```

## Props (detail descriptions)

<Seo /> has two props `type` & `data`. `type` accepts string `defaultSeo`, `homepage`, `product`, `collection` or `page`. Each with different expected `data` shape listed below.

| `type`     | `data`                                                                                                 | Description                                                                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| defaultSeo | <code>{title: string; description: string; url: string; titleTemplate?: string; lang?: string;}</code> | Seo information that should be render as default on every single page on the site. All cases below can be use in children component to override the default. |
| homepage   | <code>{title: Title; url: string; description?: Description;}</code>                                   | Seo information to be render on the Home Page of the site.                                                                                                   |
| product    | <code>[Product](https://shopify.dev/api/admin-graphql/2022-01/objects/product)</code>                  | Seo information for product page. Must included url, title, description, vendor, at least one image, at least one variant, and pricing information.          |
| collection | <code>[Collection](https://shopify.dev/api/admin-graphql/2022-01/objects/Collection)</code>            | Seo information for collection page. Must included title and description.                                                                                    |
| page       | <code>{title: string; seo: {title?: string; description?: string;}}</code>                             | Seo information for pages (ie. about, shipping). Must included title and description.                                                                        |

## Component type

The `Seo` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).
