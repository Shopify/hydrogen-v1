Hydrogen detects when a search engine crawls your shop and defaults to server-side rendering (SSR). This guide describes how to customize the output of SEO-related tags in your client and server components.

## How SEO works in Hydrogen

Hydrogen includes a [`Seo`](/api/hydrogen/components/primitive/seo) client component that renders SEO information on a webpage. It also provides the following example SEO-related files in the [Hydrogen starter template](/custom-storefronts/hydrogen/getting-started):

- [`DefaultSeo`](https://github.com/Shopify/hydrogen/blob/main/examples/template-hydrogen-default/src/components/DefaultSeo.server.jsx): A server component that fetches the shop name and description and sets default values and templates for every page on a website

- [`Sitemap.xml.server.jsx`](https://github.com/Shopify/hydrogen/blob/main/examples/template-hydrogen-default/src/routes/sitemap.xml.server.jsx): A file that generates all products, collections, and pages URLs using the Storefront API

- [`Robots.txt.server.jsx`](https://github.com/Shopify/hydrogen/blob/main/examples/template-hydrogen-default/src/routes/robots.txt.server.js): A file that sets default rules for which URLs can be crawled by search engines

### `Seo` client component

The [`Seo`](/api/hydrogen/components/primitive/seo) client component uses the data from Storefront API to generate the `<head>` tags that search engines look for. For example, [`Product.Seo`](/api/storefront/2022-01/objects/Product) is used to generate the `<head>` tags for the products page.

You can customize the `<head>` tags at the route level:

- [Default page](https://github.com/Shopify/hydrogen/blob/main/examples/template-hydrogen-default/src/components/DefaultSeo.server.jsx)
- [Home page](https://github.com/Shopify/hydrogen/blob/main/examples/template-hydrogen-default/src/routes/index.server.jsx)
- [Pages page](https://github.com/Shopify/hydrogen/blob/main/examples/template-hydrogen-default/src/routes/pages/[handle].server.jsx)
- [Product page](https://github.com/Shopify/hydrogen/blob/main/examples/template-hydrogen-default/src/routes/products/[handle].server.jsx)
- [Collection page](https://github.com/Shopify/hydrogen/blob/main/examples/template-hydrogen-default/src/routes/collections/[handle].server.jsx)

### `DefaultSeo` server component

The [`DefaultSeo`](https://github.com/Shopify/hydrogen/blob/main/examples/template-hydrogen-default/src/components/DefaultSeo.server.jsx) server component fetches your shop name (`shop.name`) and description (`shop.description`). This component provides the default SEO values for every page on your website.

You can override the default SEO values by passing in custom props:

{% codeblock file, filename: '/products/[handle].server.jsx' %}

```js
const storeFrontData = {...};
const customData = {
  ...storeFrontData,
  description: 'Custom product description',
};

<Seo type="product" data={customData} />
```

{% endcodeblock %}

## Client component example

The following example shows how to pass a `product` prop to the component to generate standard SEO-related tags for your product page:

{% codeblock file, filename: '/products/[handle].server.jsx' %}

```jsx
<Seo type="product" data={product} />
```

{% endcodeblock %}

If you want to add more custom `head` tags, then you can import `Head` from Hydrogen on any client component and use the syntax described by the [underlying Helmet library](https://github.com/nfl/react-helmet):

{% codeblock file, filename: '/products/[handle].server.jsx' %}

```jsx
// Import only client components.

import {Head} from '@shopify/hydrogen/client';

return (
  <Seo type="product" data={product} />
  <Head>
    <meta property="something" content="else" />
  </Head>
);
```

{% endcodeblock %}

## Server component example

The following example shows how to include a catch-all SEO component (`<DefaultSeo>`) that queries and populates `<head>` tags as a server component:

{% codeblock file, filename: 'App.server.jsx' %}

```jsx
import {Suspense} from 'react';

import DefaultSeo from './components/DefaultSeo.server';
import LoadingFallback from './components/LoadingFallback';

export default function App({log, ...serverState}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DefaultSeo />
      {/** ... */}
    </Suspense>
  );
}
```

{% endcodeblock %}

## Imitating SEO robot behavior

Hydrogen supports SEO by inspecting the `user-agent` for every request, and buffering the response to fully render it on server-side.

To imitate the behaviour of a SEO robot and show the page content fully from server render for initial render, add the `?\_bot` query parameter at the end of the webpage's URL.

## Limitations and considerations

The following limitations and considerations apply to the [XML sitemap](https://github.com/Shopify/hydrogen/blob/main/examples/template-hydrogen-default/src/routes/sitemap.xml.server.jsx) that's included in the Hydrogen starter template:

- The sitemap has a limit of 250 products, 250 collections, and 250 pages. You need to [paginate results](/api/usage/pagination-graphql) if your store has more than 250 resources.

  > Tip:
  > If your store has more resources than the limit, and you haven't customized the URLs of the resources, then we recommend using the Online Store version of the sitemap at `https://{store-domain}/sitemap.xml`.

- When you add or remove pages, the sitemap is automatically updated within one day. Similarly, if you unpublish a product, then the product is removed automatically from the sitemap.

- The sitemap is cached for 24 hours.

- By default, the sitemap uses the [`onlineStoreUrl`](/api/storefront/2022-01/objects/Product) field from the Storefront API as the URL. It falls back to the Hydrogen starter template URL structure, which is based on resource's handle.

## Next steps

- Learn how to manage the [state on the server](/custom-storefronts/hydrogen/framework/server-state) as you're building your Hydrogen app.
- Get familiar with the [file-based routing system](/custom-storefronts/hydrogen/framework/routes) that Hydrogen uses.
- Learn how the [page server component](/custom-storefronts/hydrogen/framework/pages) receives props, which includes custom versions of `request` and `response`.
