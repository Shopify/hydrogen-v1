<!-- This file is generated from the source code and any changes you make here will be overwritten. For more information, refer to https://github.com/Shopify/shopify-dev/blob/master/content/internal/operations/hydrogen-reference-docs.md. -->

The Hydrogen framework includes `<Seo>` client and server components. This guide describes how to customize the output of SEO-related tags in your Hydrogen client and server components.

## How SEO works

The Hydrogen framework includes a `<Seo>` client component inside your app's `components` which you can use to customize the output of SEO-related tags in your document `head`.

Hydrogen also supplies a `<DefaultSeo>` server component, which is responsible for fetching your `shop.name` and setting default values and templates for every page on your website.

## Client component examples

The following example shows how to pass a `product` prop to the component to generate standard SEO-related tags for your product page:

{% codeblock file %}

```jsx
<Seo product={product} />
```

{% endcodeblock %}

If you want to add custom `head` tags, then you can import `Helmet` from Hydrogen on any client component and use the syntax described by the [underlying Helmet library](https://github.com/nfl/react-helmet):

{% codeblock file %}

```jsx
// Client Components only!

import {Helmet} from '@shopify/hydrogen/client';

return (
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
import {ShopifyServerProvider, DefaultRoutes} from '@shopify/hydrogen';
import {Switch} from 'react-router-dom';
import {Suspense} from 'react';
import shopifyConfig from '../shopify.config';
import DefaultSeo from './components/DefaultSeo.server';
import NotFound from './components/NotFound.server';

export default function App({...serverState}) {
  const pages = import.meta.globEager('./pages/**/*.server.[jt]sx');

  return (
    <ShopifyServerProvider shopifyConfig={shopifyConfig} {...serverState}>
      <Suspense fallback="Loading...">
        <DefaultSeo />
        <Switch>
          <DefaultRoutes
            pages={pages}
            serverState={serverState}
            fallback={<NotFound />}
          />
        </Switch>
      </Suspense>
    </ShopifyServerProvider>
  );
}
```

{% endcodeblock %}

## Next steps

- Learn how to manage the [state on the server](/api/hydrogen/framework/server-state) as you're building your Hydrogen app.
- Get familiar with the [file-based routing system](/api/hydrogen/framework/routes) that Hydrogen uses.
- Learn how the [page server component](/api/hydrogen/framework/pages) receives props, which includes custom versions of `request` and `response`.
