---
gid: 271ca2e1-7842-4954-ab8c-6ba9e19c80ad
title: Hydrogen overview
description: Learn about Hydrogen, a front-end web development framework that you can use to build fast and dynamic Shopify custom storefronts.
---

> ⚠️ **Important:** [Hydrogen 2.0](https://hydrogen.shopify.dev) is out now. These archival docs are provided only to assist developers during their upgrade process. Please migrate to Hydrogen 2.0 as soon as possible.


Hydrogen is a front-end web development framework used for building [Shopify custom storefronts](/custom-storefronts/getting-started). It includes the structure, components, and tooling you need to get started so you can spend your time styling and designing features that make your brand unique.

{% include /hydrogen/hydro-ui-use-when.md prop='shopify/hydrogen' %}

{{ 'Su-x4Mo5xmU' | youtube }}

## How Hydrogen works

Hydrogen is the approach you use to build a custom storefront. It contains a framework and a library of components, hooks, and utilities:

- **Hydrogen framework**: Hydrogen provides a [Vite](https://vitejs.dev/) plugin which offers server-side rendering (SSR), hydration middleware, and client component code transformations.

- **[Hydrogen components, hooks, and utilities](/api/hydrogen)**: Hydrogen includes components, hooks, and utilities that support features and concepts that exist in Shopify. They're accessible, performant, and ready for use. They also help to reduce the initial complexity and boilerplate needed for building a custom storefront.

![A diagram that shows what Hydrogen includes: Vite offerings and Shopify-specific components, hooks, and utilities](/assets/custom-storefronts/hydrogen/hydrogen-overview.png)

> Note:
> The SSR and hydration middleware is similar to existing [Vite SSR](https://vitejs.dev/guide/ssr.html) implementations. However, Hydrogen uses [React Server Components](/custom-storefronts/hydrogen/react-server-components), which affects SSR.

## Templates

Hydrogen provides the following templates to help you get started building Shopify custom storefronts:

- [**Hello World**](/custom-storefronts/hydrogen/getting-started/templates#hello-world-template): A minimal template for developers who want to build their Hydrogen storefront from the very beginning.
- [**Demo Store**](/custom-storefronts/hydrogen/getting-started/templates#demo-store-template): The default template installed when creating a new Hydrogen storefront. It’s a full-featured Hydrogen storefront that uses live production data provided by Shopify. The demo store is an opinionated, production-ready Hydrogen storefront with the full purchase journey out-of-the-box.

For more information, refer to [Hydrogen templates](/custom-storefronts/hydrogen/getting-started/templates).

<figure class="figure">
  <img src="/assets/custom-storefronts/hydrogen/hydrogen-starter-template.gif" alt="The Demo Store template" />
  <figcaption>Demo Store template</figcaption>
</figure>

{% include hydrogen/templates.md %}

## Data sources

{% include hydrogen/shopify-data.md %}

{% include hydrogen/third-party-data.md prop='concept'%}

![A diagram that shows how the Hydrogen components, hooks, and utilities consume data](/assets/custom-storefronts/hydrogen/hydrogen-data-sources.png)

## Performance optimizations

Hydrogen's architecture enables a mix of static and dynamic data fetching between client- and server-side for optimized performance. It's built on top of newer web technology, and takes a modern approach to web development to offer the following:

- **[Built-in caching controls](/custom-storefronts/hydrogen/querying/cache)** to handle dynamic content and minimize API calls for speed and performance.

- **[Server-side rendering](/custom-storefronts/hydrogen/streaming-ssr)** to optimize the initial load.

- **[React Server Components](/custom-storefronts/hydrogen/react-server-components)**, an opinionated data-fetching and rendering flow for React apps. React Server Components offer an improved development experience. Components render fast, which allows you to see your work instantly as you’re building it.

## Request workflow for Hydrogen apps

The following diagram shows the request workflow for Hydrogen apps, based on the platform where Hydrogen is being hosted:

![A diagram that illustrates the request workflow for Hydrogen apps, based on the platform where Hydrogen is being hosted](/assets/custom-storefronts/hydrogen/hydrogen-server-entry-points.png)

### Node.js runtime

The Hydrogen app is hosted on a Node.js platform like Heroku, Vercel, or Netlify. If you've [generated a Node.js server](/custom-storefronts/hydrogen/deployment#deploy-to-node-js), then you can run it inside a [Docker container](/custom-storefronts/hydrogen/deployment#deploy-to-docker) like GCP, AWS, Azure, or Fly.io.

By default, Hydrogen includes a [`@shopify/hydrogen/platforms/node`](https://github.com/Shopify/hydrogen/blob/main/packages/hydrogen/src/platforms/node.ts) package, which is a [Connect-based](https://github.com/senchalabs/connect) Node.js server. Alternatively, you can use your own server.

### Worker (v8) runtime

The Hydrogen app is hosted on a worker platform like [Oxygen](/custom-storefronts/hydrogen/deployment#deploy-to-oxygen), [Netlify](/custom-storefronts/hydrogen/deployment#deploy-to-netlify), [Vercel](/custom-storefronts/hydrogen/deployment#deploy-to-vercel), or [Cloudflare](/custom-storefronts/hydrogen/deployment#deploy-to-cloudflare-workers).

By default, Hydrogen includes a [`@shopify/hydrogen/platforms/worker`](https://github.com/Shopify/hydrogen/blob/main/packages/hydrogen/src/platforms/worker.ts) package for server-side rendering. The Cache API and KV API are powered by Oxygen, Cloudflare, or another runtime adapter.

{% include /hydrogen/default-entry-points.md prop='with_link' %}

## Oxygen

{% include oxygen/intro.md %}

## Limitations

Hydrogen can only be used to build Shopify web storefronts. Currently, Hydrogen doesn't support building other types of custom storefronts, including mobile apps, video games, and smart devices.

## Next steps

- [Get started](/custom-storefronts/hydrogen/getting-started/) with Hydrogen and begin building a custom storefront.
- Learn about [React Server Components](/custom-storefronts/hydrogen/react-server-components), an opinionated data-fetching and rendering workflow for React apps.
- Learn how to [deploy your Hydrogen storefront](/custom-storefronts/hydrogen/deployment) to Oxygen and other runtimes.
