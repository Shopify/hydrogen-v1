The Hydrogen framework includes `<Seo>` client and server components. This guide describes how to customize the output of SEO-related tags in your Hydrogen client and server components.

## How SEO works

The Hydrogen framework work with Seo by inspects the user-agent for every request, and buffer the response to fully render the response on server side instead.

To emulate this behaviour, add `?_bot` query param at the end of url.

## What Hydrogen provides

The Hydrogen framework supplies a `<DefaultSeo>` server component, which is responsible for fetching your `shop.name` and `shop.description` to act as default seo values for every page on your website.

The Hydrogen package also includes a `<Seo>` client component that are being use on home, product, collection, and page server entry components that output the SEO-related tags in your document `head` and override the default values.

## Client component examples

The following example shows how to pass a `product` prop to the component to generate standard SEO-related tags for your product page:

{% codeblock file %}

```jsx
<Seo product={product} />
```

{% endcodeblock %}

This component can also be use for simple SEO tags such as adding image Seo to a shipping page for example.

{% codeblock file %}

```jsx
<Seo
  page={{
    title: 'Shipping',
    description: 'This page explains the shipping policy.',
  }}
  image={{
    url: 'https://shop-name.com/shipping.png';
  }}
/>
```

{% endcodeblock %}

If you want to add more custom `head` tags, then you can import `Helmet` from Hydrogen on any client component and use the syntax described by the [underlying Helmet library](https://github.com/nfl/react-helmet):

{% codeblock file %}

```jsx
// Import only client components.

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
import {DefaultRoutes} from '@shopify/hydrogen';
import {Suspense} from 'react';

import DefaultSeo from './components/DefaultSeo.server';
import NotFound from './components/NotFound.server';
import AppClient from './App.client';
import LoadingFallback from './components/LoadingFallback';

export default function App({log, url, ...serverState}) {
  const pages = import.meta.globEager('./pages/**/*.server.[jt]sx');

  return (
    <Suspense fallback={<LoadingFallback />}>
      <AppClient helmetContext={serverState.helmetContext}>
        <DefaultSeo url={url} />
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

## Next steps

- Learn how to manage the [state on the server](/custom-storefronts/hydrogen/framework/server-state) as you're building your Hydrogen app.
- Get familiar with the [file-based routing system](/custom-storefronts/hydrogen/framework/routes) that Hydrogen uses.
- Learn how the [page server component](/custom-storefronts/hydrogen/framework/pages) receives props, which includes custom versions of `request` and `response`.
