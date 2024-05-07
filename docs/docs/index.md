---
slug: /
---

# Hydrogen overview


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



Hydrogen is a front-end web development framework used for building [Shopify custom storefronts](https://shopify.dev/docs/custom-storefronts/getting-started). It includes the structure, components, and tooling you need to get started so you can spend your time styling and designing features that make your brand unique.

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/Su-x4Mo5xmU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## How Hydrogen works

Hydrogen is the approach you use to build a custom storefront. It contains a framework and a library of components, hooks, and utilities:

- **Hydrogen framework**: Hydrogen provides a [Vite](https://vitejs.dev/) plugin which offers server-side rendering (SSR), hydration middleware, and client component code transformations.

- **[Hydrogen components, hooks, and utilities](https://shopify.dev/docs/api/hydrogen)**: Hydrogen includes components, hooks, and utilities that support features and concepts that exist in Shopify. They're accessible, performant, and ready for use. They also help to reduce the initial complexity and boilerplate needed for building a custom storefront.

![A diagram that shows what Hydrogen includes: Vite offerings and Shopify-specific components, hooks, and utilities](https://shopify.dev/assets/custom-storefronts/hydrogen/hydrogen-overview.png)

> Note:
> The SSR and hydration middleware is similar to existing [Vite SSR](https://vitejs.dev/guide/ssr.html) implementations. However, Hydrogen uses [React Server Components](/tutorials/react-server-components/), which affects SSR.

## Templates

Hydrogen provides the following templates to help you get started building Shopify custom storefronts:

- [**Hello World**](/tutorials/getting-started/templates.md#hello-world-template): A minimal template for developers who want to build their Hydrogen storefront from the very beginning.
- [**Demo Store**](/tutorials/getting-started/templates.md#demo-store-template): The default template installed when creating a new Hydrogen storefront. It’s a full-featured Hydrogen storefront that uses live production data provided by Shopify. The demo store is an opinionated, production-ready Hydrogen storefront with the full purchase journey out-of-the-box.

For more information, refer to [Hydrogen templates](/tutorials/getting-started/templates/).

<figure class="figure">
  <img src="/assets/custom-storefronts/hydrogen/hydrogen-starter-template.gif" alt="The Demo Store template" />
  <figcaption>Demo Store template</figcaption>
</figure>

## Data sources

Hydrogen is built and optimized to use data coming from Shopify's [Storefront API](https://shopify.dev/api/storefront). The shape of the data passed to components, hooks, and utilities corresponds and conforms to the structure based on the GraphQL types from the Storefront API.

Hydrogen can also support data from third-party sources. If you want to use Hydrogen components with a third-party data source, then data from the third-party source must first be transformed into the types expected by the Hydrogen components, hooks, and utilities, and then passed on to the components, hooks, and utilities.{% if includes.prop == 'concept' %} Learn more about [working with third-party data sources](/tutorials/data-sources/work-with-3p-data-sources/).{% endif %}

![A diagram that shows how the Hydrogen components, hooks, and utilities consume data](https://shopify.dev/assets/custom-storefronts/hydrogen/hydrogen-data-sources.png)

## Performance optimizations

Hydrogen's architecture enables a mix of static and dynamic data fetching between client- and server-side for optimized performance. It's built on top of newer web technology, and takes a modern approach to web development to offer the following:

- **[Built-in caching controls](/tutorials/querying/cache/)** to handle dynamic content and minimize API calls for speed and performance.

- **[Server-side rendering](/tutorials/streaming-ssr/)** to optimize the initial load.

- **[React Server Components](/tutorials/react-server-components/)**, an opinionated data-fetching and rendering flow for React apps. React Server Components offer an improved development experience. Components render fast, which allows you to see your work instantly as you’re building it.

## Request workflow for Hydrogen apps

The following diagram shows the request workflow for Hydrogen apps, based on the platform where Hydrogen is being hosted:

![A diagram that illustrates the request workflow for Hydrogen apps, based on the platform where Hydrogen is being hosted](https://shopify.dev/assets/custom-storefronts/hydrogen/hydrogen-server-entry-points.png)

### Node.js runtime

The Hydrogen app is hosted on a Node.js platform like Heroku, Vercel, or Netlify. If you've [generated a Node.js server](/tutorials/deployment.md#deploy-to-node-js), then you can run it inside a [Docker container](/tutorials/deployment#deploy-to-docker) like GCP, AWS, Azure, or Fly.io.

By default, Hydrogen includes a [`@shopify/hydrogen/platforms/node`](https://github.com/Shopify/hydrogen/blob/main/packages/hydrogen/src/platforms/node.ts) package, which is a [Connect-based](https://github.com/senchalabs/connect) Node.js server. Alternatively, you can use your own server.

### Worker (v8) runtime

The Hydrogen app is hosted on a worker platform like [Oxygen](/tutorials/deployment.md#deploy-to-oxygen), [Netlify](/tutorials/deployment.md#deploy-to-netlify), [Vercel](/tutorials/deployment.md#deploy-to-vercel), or [Cloudflare](/tutorials/deployment#deploy-to-cloudflare-workers).

By default, Hydrogen includes a [`@shopify/hydrogen/platforms/worker`](https://github.com/Shopify/hydrogen/blob/main/packages/hydrogen/src/platforms/worker.ts) package for server-side rendering. The Cache API and KV API are powered by Oxygen, Cloudflare, or another runtime adapter.

Hydrogen includes the following default entry points for your app:

- **Client entry point**: [`@shopify/hydrogen/entry-client`](https://github.com/Shopify/hydrogen/blob/main/packages/hydrogen/src/entry-client.tsx), which is included in [`index.html`](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/index.html) and used for hydration purposes
- **Server entry point**: [`App.server.jsx`](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/App.server.jsx)

You can [configure the default entry points](/tutorials/data-sources/configure-default-entry-points/) for your app.
## Oxygen

[Oxygen](https://shopify.dev/docs/custom-storefronts/oxygen) is Shopify's recommended deployment platform for Hydrogen storefronts. Oxygen removes the need to maintain server infrastructure, and enables you to manage and deploy Hydrogen storefronts. You can deploy different Hydrogen storefronts to Oxygen environments, enabling you to preview and share different versions of storefronts.

## Limitations

Hydrogen can only be used to build Shopify web storefronts. Currently, Hydrogen doesn't support building other types of custom storefronts, including mobile apps, video games, and smart devices.

## Next steps

- [Get started](/tutorials/getting-started/) with Hydrogen and begin building a custom storefront.
- Learn about [React Server Components](/tutorials/react-server-components/), an opinionated data-fetching and rendering workflow for React apps.
- Learn how to [deploy your Hydrogen storefront](/tutorials/deployment/) to Oxygen and other runtimes.
