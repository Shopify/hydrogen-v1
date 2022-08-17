---
gid: 30ba6db5-9196-467b-b9c6-886ca42c82ad
title: Hydrogen framework overview
description: Learn about the architecture and framework of Hydrogen.
---

Hydrogen includes a framework that offers a set of best practices and scaffolding for building a website. This guide provides an overview of Hydrogen's architecture and framework.

## What's the Hydrogen framework?

Hydrogen is the approach you use to build a custom storefront. The Hydrogen framework includes a [Vite](https://vitejs.dev/) plugin that offers server-side rendering (SSR), hydration middleware, and client component code transformations.

![A diagram that illustrates Vite's offering of server-side rendering (SSR) and hydration middleware, and client component code transformations](/assets/custom-storefronts/hydrogen/hydrogen-framework-overview.png)

> Note:
> The SSR and hydration middleware is similar to existing [Vite SSR](https://vitejs.dev/guide/ssr.html) implementations. However, Hydrogen uses [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components), which affects SSR.

## Hydrogen project structure

Hydrogen offers different templates that provide paths to building Shopify custom storefronts:

- **Hello World**: A minimal template for developers who want to build their Hydrogen storefront from the very beginning
- **Demo Store**: A full-featured template that demonstrates an opinionated, production-ready Hydrogen storefront with the full purchase journey out-of-the-box

For more information, refer to [Hydrogen templates](https://shopify.dev/custom-storefronts/hydrogen/templates).

## Request workflow for Hydrogen apps

The following diagram shows the request workflow for Hydrogen apps, based on the platform where Hydrogen is being hosted:

![A diagram that illustrates the request workflow for Hydrogen apps, based on the platform where Hydrogen is being hosted](/assets/custom-storefronts/hydrogen/hydrogen-server-entry-points.png)

### Node.js runtime

The Hydrogen app is hosted on a Node.js platform like Heroku, Vercel, or Netlify. If you've [generated a Node.js server](https://shopify.dev/custom-storefronts/hydrogen/deployment#deploy-to-node-js), then you can run it inside a [Docker container](https://shopify.dev/custom-storefronts/hydrogen/deployment#deploy-to-docker) like GCP, AWS, Azure, or Fly.io.

By default, Hydrogen includes a [`@shopify/hydrogen/platforms/node`](https://github.com/Shopify/hydrogen/blob/main/packages/hydrogen/src/platforms/node.ts) package, which is a [Connect-based](https://github.com/senchalabs/connect) Node.js server. Alternatively, you can use your own server.

### Worker (v8) runtime

The Hydrogen app is hosted on a worker platform like [Oxygen](https://shopify.dev/custom-storefronts/hydrogen/deployment#deploy-to-oxygen), [Netlify](https://shopify.dev/custom-storefronts/hydrogen/deployment#deploy-to-netlify), [Vercel](https://shopify.dev/custom-storefronts/hydrogen/deployment#deploy-to-vercel), or [Cloudflare](https://shopify.dev/custom-storefronts/hydrogen/deployment#deploy-to-cloudflare-workers).

By default, Hydrogen includes a [`@shopify/hydrogen/platforms/worker`](https://github.com/Shopify/hydrogen/blob/main/packages/hydrogen/src/platforms/worker.ts) package for server-side rendering. The Cache API and KV API are powered by Oxygen, Cloudflare, or another runtime adapter.

## Configuring default entry points

Hydrogen includes the following default entry points for your app:

- **Client entry point**: [`@shopify/hydrogen/entry-client`](https://github.com/Shopify/hydrogen/blob/main/packages/hydrogen/src/entry-client.tsx), which is included in [`index.html`](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/index.html) and used for hydration purposes
- **Server entry point**: [`App.server.jsx`](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/App.server.jsx)

### Change the client entry point

If you need to change the client entry point, then create a new file such as `src/entry-client.jsx` with the following code and update the path in `index.html`:

{% codeblock file, filename: 'src/entry-client.jsx' %}

```jsx
import renderHydrogen from '@shopify/hydrogen/entry-client';

const ClientWrapper = (props) => props.children;

export default renderHydrogen(ClientWrapper);
```

{% endcodeblock %}

{% codeblock file, filename: 'index.html' %}

```html
<script type="module" src="/src/entry-client"></script>
```

{% endcodeblock %}

### Change the server entry point

If you need to change the server entry point, then make the following updates in the `package.json` file:

- **Development**: Pass a `HYDROGEN_SERVER_ENTRY` environment variable to the development command.
- **Production**: Use a `--ssr` flag when building your app.

{% codeblock file, filename: 'package.json' %}

```json
"scripts": {
  "dev": "HYDROGEN_SERVER_ENTRY=/my/path/MyApp.server vite",
  ...
  "build:server": "vite build --ssr /my/path/MyApp.server",
  ...
},
```

{% endcodeblock %}

## Next steps

- Get familiar with the different [templates](https://shopify.dev/custom-storefronts/hydrogen/templates) that help you get started with Hydrogen.
- Learn about [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components), an opinionated data-fetching and rendering workflow for React apps.
- Learn how to [deploy your Hydrogen storefront](https://shopify.dev/custom-storefronts/hydrogen/deployment) to Oxygen and other runtimes.
