Hydrogen includes `<Seo>` client and server components. This guide describes how to customize the output of SEO-related tags in your Hydrogen client and server components.

## How SEO works in Hydrogen

The [Hydrogen starter template](/custom-storefronts/hydrogen/getting-started) provides a [`<DefaultSeo>`](https://github.com/Shopify/hydrogen/blob/main/examples/template-hydrogen-default/src/components/DefaultSeo.server.jsx) server component that fetches your `shop.name` and `shop.description`. This component provides the default SEO values for every page on your website.

Hydrogen also includes a [`<Seo>`](/api/hydrogen/components/primitive/seo) client component that you can use to output the SEO-related tags in your document `head` and override the default values on the following pages:

- [Default page](https://github.com/Shopify/hydrogen/blob/main/examples/template-hydrogen-default/src/components/DefaultSeo.server.jsx)
- [Home page](https://github.com/Shopify/hydrogen/blob/main/examples/template-hydrogen-default/src/pages/index.server.jsx)
- [Product page](https://github.com/Shopify/hydrogen/blob/main/examples/template-hydrogen-default/src/pages/products/[handle].server.jsx)
- [Collection page](https://github.com/Shopify/hydrogen/blob/main/examples/template-hydrogen-default/src/pages/collections/[handle].server.jsx)
- [Pages page](https://github.com/Shopify/hydrogen/blob/main/examples/template-hydrogen-default/src/pages/pages/[handle].server.jsx)

### Imitating SEO robot behavior

Hydrogen supports SEO by inspecting the `user-agent` for every request, and buffering the response to fully render it on server-side. To imitate the behaviour of a SEO robot and show the page content fully from server render for initial render, add the `?\_bot` query parameter at the end of the webpage's URL.

## Client component examples

The following example shows how to pass a `product` prop to the component to generate standard SEO-related tags for your product page:

{% codeblock file %}

```jsx
<Seo type="product" data={product} />
```

{% endcodeblock %}

If you want to add more custom `head` tags, then you can import `Helmet` from Hydrogen on any client component and use the syntax described by the [underlying Helmet library](https://github.com/nfl/react-helmet):

{% codeblock file %}

```jsx
// Import only client components.

import {Helmet} from '@shopify/hydrogen/client';

return (
  <Seo type="product" data={product} />
  <Helmet>
    <meta property="something" content="else" />
  </Helmet>
);
```

{% endcodeblock %}

## Server component examples

The following example shows how to include a catch-all SEO component (`<DefaultSeo>`) that queries and populates `<head>` tags as a server component:

{% codeblock file, filename: 'App.server.jsx' %}

```jsx
import {DefaultRoutes} from '@shopify/hydrogen';
import {Suspense} from 'react';

import DefaultSeo from './components/DefaultSeo.server';
import NotFound from './components/NotFound.server';
import AppClient from './App.client';
import LoadingFallback from './components/LoadingFallback';

export default function App({log, ...serverState}) {
  const pages = import.meta.globEager('./pages/**/*.server.[jt]sx');

  return (
    <Suspense fallback={<LoadingFallback />}>
      <AppClient>
        <DefaultSeo />
        <DefaultRoutes
          pages={pages}
          serverState={serverState}
          log={log}
          fallback={<NotFound />}
        />
      </AppClient>
    </Suspense>
  );
}
```

{% endcodeblock %}

## Limitations and considerations

The following limitations and considerations apply to the [XML sitemap](https://github.com/Shopify/hydrogen/blob/main/examples/template-hydrogen-default/src/pages/sitemap.xml.server.jsx) that's included in the Hydrogen starter template:

- The sitemap has a limit of 250 products, 250 collections, and 250 pages. You need to [paginate results](/api/usage/pagination-graphql) if your store has more than 250 resources. If your store has more resources than the limit, and you haven't customized the URLs of the resources, then we recommend using the Online Store version of the sitemap at `https://{store-domain}/sitemap.xml`.

- When you add or remove pages, the sitemap is automatically updated within one day. Similarly, if you unpublish a product, then the product is removed automatically from the sitemap.

- The sitemap is cached for 24 hours.

- By default, the sitemap uses the [`onlineStoreUrl`](/api/storefront/2022-01/objects/Product) field from the Storefront API as the URL. It falls back to the Hydrogen starter template URL structure, which is based on resource's handle.

## Next steps

- Learn how to manage the [state on the server](/custom-storefronts/hydrogen/framework/server-state) as you're building your Hydrogen app.
- Get familiar with the [file-based routing system](/custom-storefronts/hydrogen/framework/routes) that Hydrogen uses.
- Learn how the [page server component](/custom-storefronts/hydrogen/framework/pages) receives props, which includes custom versions of `request` and `response`.
