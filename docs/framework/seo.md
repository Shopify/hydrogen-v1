---
gid: f89f8b4b-65b3-4942-b597-3de1093c8f1f
title: SEO
description: Learn how to customize the output of SEO-related tags in your Hydrogen client and server components.
---

This guide describes how to customize the output of SEO-related tags in your client and server components.

## How SEO works in Hydrogen

Hydrogen includes an [`Seo`](https://shopify.dev/api/hydrogen/components/primitive/seo) client component that renders SEO information on a webpage. It also provides the following example SEO-related files in the [Demo Store template](https://shopify.dev/custom-storefronts/hydrogen/templates):

- [`DefaultSeo`](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/components/DefaultSeo.server.tsx): A server component that fetches the shop name and description and sets default values and templates for every page on a website

- [`Sitemap.xml.server.ts`](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/routes/sitemap.xml.server.ts): A file that generates all products, collections, and pages URLs using the Storefront API

- [`Robots.txt.server.ts`](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/routes/robots.txt.server.ts): A file that sets default rules for which URLs can be crawled by search engines

### `Seo` client component

The [`Seo`](https://shopify.dev/api/hydrogen/components/primitive/seo) client component uses the data from Storefront API to generate the `<head>` tags that search engines look for. For example, [`Product.Seo`](https://shopify.dev/api/storefront/latest/objects/Product) is used to generate the `<head>` tags for the products page.

You can customize the `<head>` tags at the route level:

- [Default page](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/components/DefaultSeo.server.tsx)
- [Home page](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/routes/index.server.tsx)
- [Pages page](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/routes/pages/%5Bhandle%5D.server.tsx)
- [Product page](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/routes/products/%5Bhandle%5D.server.tsx)
- [Collection page](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/routes/collections/%5Bhandle%5D.server.tsx)

### `DefaultSeo` server component

The [`DefaultSeo`](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/components/DefaultSeo.server.tsx) server component is part of the [Demo Store template](https://shopify.dev/custom-storefronts/hydrogen/templates#demo-store-template). This component provides the default SEO values for every page on your website.

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

## Generate SEO tags

The `Seo` component has two props: `type` and `data`. The `type` prop accepts `defaultSeo`,`homepage`, `product`, `collection`, `page`, or `noindex`.

Each `type` expects a different `data` shape. The following example shows how to use an SEO component of type `product` and pass a `product` object into the `data` prop.  This allows the component to generate standard SEO-related tags for your product page:

{% codeblock file, filename: '/products/[handle].server.jsx' %}

```jsx
<Seo type="product" data={product} />
```

{% endcodeblock %}

If you want to add more custom `head` tags, then you can import `Head` from Hydrogen on any client component and use the syntax described by the [underlying Helmet library](https://github.com/nfl/react-helmet):

{% codeblock file, filename: '/products/[handle].server.jsx' %}

```jsx
import {Head} from '@shopify/hydrogen';

return (
  <>
    <Seo type="product" data={product} />
    <Head>
      <meta property="something" content="else" />
    </Head>
  </>
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

export default function App({log, ...serverProps}) {
  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <DefaultSeo />
      </Suspense>
      {/** ... */}
    </>
  );
}
```

{% endcodeblock %}

## Overwriting title template

In the [Demo Store template](https://shopify.dev/custom-storefronts/hydrogen/templates#demo-store-template), the titles for all pages are `%s - ${data.title}`, where `%s` is the title of children components. If you want to use a different pattern, then you can overwrite the title template for all pages using a `defaultSeo` type `Seo` component, or for a single page by updating the `Head` title.

> Note:
> **Hydrogen** is the default label that displays on the browser tab. You can edit the label by updating the text in the `<title>` tag in `index.html`.

### Overwrite for all pages

The following example shows how to overwrite title template for all pages (for example, `Fullstack Snow Board | Snowdevil`):

{% codeblock file, filename: 'DefaultSeo.server.jsx' %}

```jsx
...
  return (
    <Seo
      type="defaultSeo"
      data={% raw %}{{
        title: name,
        description,
+       titleTemplate: `%s | ${name}`
      }}{% endraw %}
    />
  );
...
```

{% endcodeblock %}

### Overwrite for a single page

The following example shows how to overwrite title template for a single page:

{% codeblock file, filename: '/mypage.server.jsx' %}

```jsx
import {Head} from '@shopify/hydrogen';

return (
  <Head titleTemplate="%s">
    <title>My Page</title>
  </Head>
);
```

{% endcodeblock %}

## SEO bot behavior

By default, all routes in Hydrogen are stream rendered. However, Hydrogen supports SEO by inspecting the `user-agent` for every request, disabling streaming, and buffering the response to fully render it on the server-side. This enables you to properly inject `head` tags when the page is being served to SEO crawlers and bots.

### Imitating robot behavior

To imitate the behavior of an SEO bot and show the page content fully from server render for an initial render, add the `?_bot` query parameter at the end of the webpage's URL.

### Checking for custom robots

If you find a bot that's not recognized by Hydrogen's bot detection algorithm, then you can [manually disable streaming](https://shopify.dev/custom-storefronts/hydrogen/framework/routes#response-donotstream) to buffer the response and make the content immediately available to bots:

{% codeblock file, filename: 'App.server.jsx' %}

```jsx
function App({request, response}) {
  if (request.headers.get('user-agent') === 'custom bot') {
    response.doNotStream();
  }

  return <Suspense fallback={'Loading...'}>{/*...*/}</Suspense>;
}

export default renderHydrogen(App);
```

{% endcodeblock %}

## Removing SEO with noindex

Pages that require authentication shouldn't be indexed by bots. For example, bots shouldn't index login and account pages. You can tell bots to not index a page by passing `noindex` to the `Seo` component:

{% codeblock file, filename: '/account/login.server.jsx' %}

```jsx
<Seo type="noindex" data={% raw %}{{title: 'Login'}}{% endraw %} />
```

{% endcodeblock %}

## Limitations and considerations

The following limitations and considerations apply to the [XML sitemap](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/routes/sitemap.xml.server.ts) that's included in the Demo Store template:

- The sitemap has a limit of 250 products, 250 collections, and 250 pages. You need to [paginate results](https://shopify.dev/api/usage/pagination-graphql) if your store has more than 250 resources.

  > Tip:
  > If your store has more resources than the limit, and you haven't customized the URLs of the resources, then we recommend using the Online Store version of the sitemap at `https://{store-domain}/sitemap.xml`.

- When you add or remove pages, the sitemap is automatically updated within one day. Similarly, if you unpublish a product, then the product is removed automatically from the sitemap.

- The sitemap is cached for 24 hours.

- By default, the sitemap uses the [`onlineStoreUrl`](https://shopify.dev/api/storefront/latest/objects/Product) field from the Storefront API as the URL. It falls back to the Demo Store template URL structure, which is based on resource's handle.

## Related components

- [`Seo`](https://shopify.dev/api/hydrogen/components/primitive/seo)

## Next steps

- Learn about the [analytics support](https://shopify.dev/custom-storefronts/hydrogen/framework/analytics) built into Hydrogen.
