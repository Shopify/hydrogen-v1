# Manage SEO


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::


This guide describes how to customize the output of SEO-related tags in your client and server components.

## Customize SEO at the route level

At the route level, you can customize [the `<head>` tags](/tutorials/seo/index.md#seo-client-component) that search engines look for.

- [Home page](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/routes/index.server.tsx)
- [Pages page](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/routes/pages/%5Bhandle%5D.server.tsx)
- [Product page](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/routes/products/%5Bhandle%5D.server.tsx)
- [Collection page](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/routes/collections/%5Bhandle%5D.server.tsx)

## Override default server component SEO values

You can override the default SEO values by passing in custom props:

```js
// /products/[handle].server.jsx

const storeFrontData = {...};
const customData = {
  ...storeFrontData,
  description: 'Custom product description',
};

<Seo type="product" data={customData} />
```



## Generate SEO tags

The `Seo` component has two props: `type` and `data`. The `type` prop accepts `defaultSeo`,`homepage`, `product`, `collection`, `page`, or `noindex`.

Each `type` expects a different `data` shape.

The following example shows how to use an SEO component of type `product` and pass a `product` object into the `data` prop. This allows the component to generate standard SEO-related tags for your product page:

```jsx
// /products/[handle].server.jsx

<Seo type="product" data={product} />
```



### Add custom `head` tags to the `Seo` component

Import `Head` from Hydrogen on any client component and use the syntax described by the [underlying Helmet library](https://github.com/nfl/react-helmet):

```jsx
// /products/[handle].server.jsx

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



## Query and populate `<head>` tags as a server component

The following example shows how to include a catch-all SEO component with the type `defaultSeo` that queries and populates `<head>` tags as a server component:

```jsx
// App.server.jsx


import {Suspense} from 'react';

import LoadingFallback from './components/LoadingFallback';

export default function App({log, ...serverProps}) {
  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <ShopifyProvider countryCode={countryCode}>
          <Seo
            type="defaultSeo"
            data={{
              title: 'Hydrogen',
              description:
                "A custom storefront powered by Hydrogen, Shopify's React-based framework for building headless.",
              titleTemplate: `%s · Hydrogen`,
            }}
          />
      </Suspense>
      {/** ... */}
    </>
  );
}

```



## Overwriting title template

In the [Demo Store template](/tutorials/getting-started/templates.md#demo-store-template), the titles for all pages are `%s - ${data.title}`, where `%s` is the title of children components. If you want to use a different pattern, then you can overwrite the title template for all pages using a `defaultSeo` type `Seo` component, or for a single page by updating the `Head` title.

> Note:
> **Hydrogen** is the default label that displays on the browser tab. You can edit the label by updating the text in the `<title>` tag in `index.html`.

### Overwrite for all pages

The following example shows how to overwrite title template for all pages (for example, `Fullstack Snow Board | Snowdevil`):

```jsx
// DefaultSeo.server.jsx

...
  return (
    <Seo
      type="defaultSeo"
      data={{
        title: name,
        description,
+       titleTemplate: `%s | ${name}`
      }}
    />
  );
...
```



### Overwrite for a single page

The following example shows how to overwrite title template for a single page:

```jsx
// /mypage.server.jsx

import {Head} from '@shopify/hydrogen';

return (
  <Head titleTemplate="%s">
    <title>My Page</title>
  </Head>
);
```



## SEO bots

The following are common tasks for working with bots.

### Imitate robot behavior

To imitate the behavior of an SEO bot and show the page content fully from server render for an initial render, add the `?_bot` query parameter at the end of the webpage's URL.

### Check for custom robots

If you find a bot that's not recognized by Hydrogen's bot detection algorithm, then you can [manually disable streaming](/tutorials/routing/manage-routes.md#disable-streaming-for-routes) to buffer the response and make the content immediately available to bots:

```jsx
// App.server.jsx

function App({request, response}) {
  if (request.headers.get('user-agent') === 'custom bot') {
    response.doNotStream();
  }

  return <Suspense fallback={'Loading...'}>{/*...*/}</Suspense>;
}

export default renderHydrogen(App);
```



### Remove SEO with noindex

Pages that require authentication shouldn't be indexed by bots. For example, bots shouldn't index login and account pages. You can tell bots to not index a page by passing `noindex` to the `Seo` component:

```jsx
// /account/login.server.jsx

<Seo type="noindex" data={{title: 'Login'}} />
```


