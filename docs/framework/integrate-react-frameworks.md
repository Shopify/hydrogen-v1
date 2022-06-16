---
gid: 473df70d-1ca3-37v9-ab92-0d91efb8c97c
title: Integrate with other React frameworks
description: Learn how to integrate Hydrogen with an existing React framework that you're using.
---

The majority of [Hydrogen components](https://shopify.dev/api/hydrogen/components) accept data from the Storefront API and render just like regular React components. This means you can use Hydrogen components in other React frameworks like [Next.js](https://nextjs.org/) or [Gatsby](https://www.gatsbyjs.com/).

Shopify hasn't optimized integrating with other frameworks, so you need to follow some special instructions to make it work. While the instructions in this guide are specific Next.js, you can follow a similar pattern to support other frameworks.

## Get started with Next.js

1. In your Next.js app, install Hydrogen and `next-transpile-modules`:

    {% codeblock terminal %}

    ```bash?filename: 'Terminal', title: 'yarn'
    yarn add @shopify/hydrogen next-transpile-modules
    ```

    ```bash?filename: 'Terminal', title: 'npm'
    npm install @shopify/hydrogen next-transpile-modules --save
    ```

    {% endcodeblock %}

2. Instruct Next.js to compile `@shopify/hydrogen` from ESM (ES Modules) to CJS (CommonJS) by editing your `next.config.js` file:

    {% codeblock file, filename: 'next.config.js' %}

    ```js
    // Hydrogen components are only exported as ESM, not CJS. Shopify will support
    // multiple export types in a future version of Hydrogen, so the extra transpile
    // step is a temporary workaround.
    const withTM = require("next-transpile-modules")(["@shopify/hydrogen"]);

    module.exports = withTM({
      reactStrictMode: true,
    });
    ```

    {% endcodeblock %}

## Fetch data in Next.js

Shopify recommends calling the Storefront API on the server. Hydrogen will soon introduce a mechanism to make server-to-server calls without exhausting rate limits, so it's best to structure your apps this way from the start.

The following example shows the general structure of a product page in Next.js. For more information, refer to the [Hydrogen components in Next.js GitHub discussion](https://github.com/Shopify/hydrogen/discussions/240).

{% codeblock file, filename: 'routes/products/[handle].js' %}

```js
import {Product} from '@shopify/hydrogen';

export async function getStaticProps({params}) {
  // Shopify recommends writing a utility like `getShopifyData({query, variables})`,
  // which takes your Storefront API credentials and makes a GraphQL query. You can then
  // use this in the Next.js functions.
  const {data} = getShopifyData({query: QUERY, variables: {handle: params.handle}});

  return {
    props: data,
    revalidate: 5,
  };
}

export function Product({data}) {
  return (
    <Product product={data.product}>
      {/** ... */}
    </Product>
  );
}
```

{% endcodeblock %}

## Limitations

The following limitations apply when using Hydrogen components in Next.js.

### You can't use `useShopQuery` in Next.js

You can't use [`useShopQuery`](https://shopify.dev/api/hydrogen/hooks/global/useshopquery) in Next.js because it's a hook that is meant to be run in Hydrogen's server components. Since the stable version of Next.js doesn't allow you to render a component only on the server, you need to fetch data in a `getStaticProps` or `getServerSideProps` function instead.

### You can't use server components in Next.js

Hydrogen is currently using a modified version of server components which supports context and SSR (server-side rendering). This isn't yet supported in the version of server components that Next.js uses.

If you want to use the Alpha version of server components in Next.js, then you need to wrap any Hydrogen component that use `Context` in `*.client.js` components. This is the only way to currently use context in Next.js server components.
