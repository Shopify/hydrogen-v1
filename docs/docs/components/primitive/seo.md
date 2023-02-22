# Seo


The `Seo` component renders SEO information on a webpage. You can [customize this component](/components#customizing-hydrogen-components) using passthrough props.

## Example code

```tsx
import {Seo, useShopQuery, useRouteParams, gql} from '@shopify/hydrogen';

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

export default function Page() {
  const {handle} = useRouteParams();
  const {data} = useShopQuery({query: QUERY, variables: {handle}});

  if (!data.pageByHandle) {
    return <NotFound />;
  }

  const page = data.pageByHandle;

  return <Seo type="page" data={page} />;
}
```

## Props

The `Seo` component has two props: `type` and `data`. The `type` prop accepts `defaultSeo`, `homepage`, `product`, `collection`, `page`, or `noindex`. Each `type` expects a different `data` shape.

| Type       | Data                                                                            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| defaultSeo | `Omit&.md#60;DefaultPageType, 'url'&#62;`<br /><strong>Data shape:</strong><br /><pre>{<br />  title: string; <br />  description: string; <br />  titleTemplate?: string; <br />  lang?: string;<br />}</pre>                           | The SEO information to render as default on every page of the website. This includes the defaults for title, description, and title template. <br />The title template defaults to the pattern of `%s - ${data.title}`, where `%s` is the title of children components. You can [overwrite this pattern](https://shopify.dev/custom-storefronts/hydrogen/seo/manage-seo#overwriting-title-template) using the `data.titleTemplate` prop. <br />The language defaults to the locale within the [`ShopifyProvider` component](/components/global/shopifyprovider). |
| homepage   | `Omit&#60;HomePageType, 'url'&#62;`                                  | The SEO information to render on the home page of the website. Corresponds to the Storefront API's [Seo object](https://shopify.dev/api/storefront/latest/objects/seo).                                                                                                                                                                                                                                                                                                                                                                                                |
| product    | `Omit&#60;ComponentProps&#60;typeof ProductSeo&#62;, 'url'&#62;`     | The SEO information to render on the product page. Corresponds to the Storefront API's [Product object](https://shopify.dev/api/storefront/latest/objects/product).                                                                                                                                                                                                                                                                                                                                                                                                    |
| collection | `Omit&#60;ComponentProps&#60;typeof CollectionSeo&#62;, 'url'&#62;`  | The SEO information to render on the collection page. Corresponds to the Storefront API's [Collection object](https://shopify.dev/api/storefront/latest/objects/collection).                                                                                                                                                                                                                                                                                                                                                                                           |
| page       | `Omit&#60;ComponentProps&#60;typeof PageSeo&#62;, 'url'&#62;`        | The SEO information to render on pages (for example, "About" or "Shipping"). Corresponds to the Storefront API's [Page object](https://shopify.dev/api/storefront/latest/objects/page).                                                                                                                                                                                                                                                                                                                                                                                |
| noindex    | `Omit&#60;ComponentProps&#60;typeof NoIndexPageSeo&#62;, 'url'&#62;`<br /><strong>Data shape:</strong><br /><pre>{<br />  title: string; <br />  titleTemplate?: string; <br />  lang?: string;<br />}</pre> | Instructs bots to not index a page (for example, an authenticated account management page).                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

## Component type

The `Seo` component is a shared component, which means that it renders on both the server and the client. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Related framework topics

- [SEO](https://shopify.dev/custom-storefronts/hydrogen/seo)
