---
gid: 30ba6db5-9196-467b-b9c6-886ca42c82ad
title: Hydrogen framework overview
description: Learn about the architecture and framework of Hydrogen.
---

<aside class="note beta">
<h4>Developer preview</h4>

<p>This is a developer preview of Hydrogen. The documentation will be updated as Shopify introduces <a href="https://github.com/Shopify/hydrogen/releases">new features and refines existing functionality</a>.</p>

</aside>

Hydrogen includes a framework that offers a set of best practices and scaffolding for building a website. This guide provides an overview of Hydrogen's architecture and framework.

## What's the Hydrogen framework?

Hydrogen is the approach you use to build a custom storefront. The Hydrogen framework includes a [Vite](https://vitejs.dev/) plugin that offers server-side rendering (SSR), hydration middleware, and client component code transformations.

![A diagram that illustrates Vite's offering of server-side rendering (SSR) and hydration middleware, and client component code transformations](/assets/custom-storefronts/hydrogen/hydrogen-framework-overview.png)

> Note:
> The SSR and hydration middleware is similar to existing [Vite SSR](https://vitejs.dev/guide/ssr.html) implementations. However, Hydrogen uses [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components), which affects SSR.

## Hydrogen project structure

When you [create a Hydrogen app](https://shopify.dev/custom-storefronts/hydrogen/getting-started/create#step-1-create-a-new-hydrogen-app), the Demo Store template initializes a basic file structure of a Hydrogen project that's integrated with a Shopify store.

Most of the files that you'll work with in the Hydrogen project are located in the `/src` directory. The `/src` directory contains the following:

- A set of boilerplate [`components`](https://shopify.dev/custom-storefronts/hydrogen/getting-started#components) and [`routes`](https://shopify.dev/custom-storefronts/hydrogen/getting-started#routes)
- The main app component in `App.server.jsx`, which includes boilerplate code for the app and routing. This file is also the main entry point for the server.
- Basic styles provided by Tailwind CSS (`index.css`)

{% codeblock file, filename: "File structure of the Demo Store template" %}

```
└── src
    ├── components
        └── Button.client.jsx
        └── Cart.client.jsx
        └── CartIcon.jsx
        └── ...
    ├── routes
        └── collections
            └── [handle].server.jsx
        └── pages
            └── [handle].server.jsx
        └── products
            └── [handle].server.jsx
        └── index.server.jsx
        └── redirect.server.jsx
        └── robots.txt.server.js
        └── sitemap.xml.server.jsx
    ├── App.server.jsx
    ├── index.css
```

{% endcodeblock %}

## Request workflow for Hydrogen apps

The following diagram shows the request workflow for Hydrogen apps, based on the platform where Hydrogen is being hosted:

![A diagram that illustrates the request workflow for Hydrogen apps, based on the platform where Hydrogen is being hosted](/assets/custom-storefronts/hydrogen/hydrogen-server-entry-points.png)

### Node.js runtime

The Hydrogen app is hosted on a Node.js platform like Heroku, Vercel, or Netlify. If you've [generated a Node.js server](https://shopify.dev/custom-storefronts/hydrogen/deployment#deploy-to-node-js), then you can run it inside a [Docker container](https://shopify.dev/custom-storefronts/hydrogen/deployment#deploy-to-docker) like GCP, AWS, Azure, or Fly.io.

By default, Hydrogen includes a [`@shopify/hydrogen/platforms/node`](https://github.com/Shopify/hydrogen/blob/main/packages/hydrogen/src/platforms/node.ts) package, which is a [Connect-based](https://github.com/senchalabs/connect) Node.js server. Alternatively, you can use your own server.

### Worker (v8) runtime

The Hydrogen app is hosted on a worker platform like [Oxygen](https://shopify.dev/custom-storefronts/hydrogen/deployment#deploy-to-cloudflare-workers) or [Cloudflare](https://shopify.dev/custom-storefronts/hydrogen/deployment#deploy-to-oxygen).

By default, Hydrogen includes a [`@shopify/hydrogen/platforms/worker`](https://github.com/Shopify/hydrogen/blob/main/packages/hydrogen/src/platforms/worker.ts) package for server-side rendering. The Cache API and KV API are powered by Oxygen, Cloudflare, or another runtime adapter.

## Configuring default entry points

Hydrogen's includes the following default entry points for your app:

- **Client entry point**: [`@shopify/hydrogen/entry-client`](https://github.com/Shopify/hydrogen/blob/main/packages/hydrogen/src/entry-client.tsx), which is included in [`index.html`](https://github.com/Shopify/hydrogen/blob/main/examples/template-hydrogen-default/index.html) and used for hydration purposes
- **Server entry point**: [`App.server.jsx`](https://github.com/Shopify/hydrogen/blob/main/examples/template-hydrogen-default/src/App.server.jsx)

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

#### Strict mode

[Strict mode](https://reactjs.org/docs/strict-mode.html) is enabled by default for all Hydrogen apps in development. It includes [strict effects](https://github.com/reactwg/react-18/discussions/19), which mounts and unmounts components multiple times to catch potential issues with user or third-party code.

If strict effects cause problems for your app, then you can turn off strict mode. Create a `src/entry-client.jsx` file in your project and set `strictMode` to `false`:

{% codeblock file, filename: 'src/entry-client.jsx' %}

```jsx
renderHydrogen(ClientWrapper, {strictMode: false});
```

{% endcodeblock %}

> Caution:
> If you turn off strict mode, then we recommended that you still include the `StrictMode` component at as high of a level as possible in your React tree to catch errors.

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

- Learn about [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components), an opinionated data-fetching and rendering workflow for React apps.
