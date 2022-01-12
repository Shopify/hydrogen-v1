<aside class="note beta">
<h4>Developer preview</h4>

<p>This is a developer preview of Hydrogen. The documentation will be updated as Shopify introduces <a href="https://github.com/Shopify/hydrogen/releases">new features and refines existing functionality</a>.</p>

</aside>

Hydrogen includes a framework that offers a set of best practices and scaffolding for building a website. This guide provides an overview of Hydrogen's architecture and framework.

## What's the Hydrogen framework?

Hydrogen is the approach you use to build a custom storefront. It includes a [Vite](https://vitejs.dev/) plugin that offers server-side rendering (SSR) and hydration middleware, as well as server and client component code transformations.
The SSR and hydration middleware is similar to existing [Vite SSR](https://vitejs.dev/guide/ssr.html) implementations.

Hydrogen comes with [React Router](https://reactrouter.com/), a tool that allows you to handle routes in your app using dynamic routing.

![A diagram that illustrates Vite's offering of server-side rendering (SSR) and hydration middleware, and server and client component code transformations](/assets/custom-storefronts/hydrogen/hydrogen-framework-overview.png)

## Hydrogen project structure

When you [create a Hydrogen app](/custom-storefronts/hydrogen/getting-started/create#step-1-create-a-new-hydrogen-app), the Hydrogen starter template initializes a basic file structure of a Hydrogen project that's integrated with a Shopify store. Most of the files that you'll work with in the Hydrogen project are located in the `/src` directory. The `/src` directory contains the following:

- A set of boilerplate [`components`](/custom-storefronts/hydrogen/getting-started#components) and [`pages`](/custom-storefronts/hydrogen/getting-started#pages)
- The main app component, which includes boilerplate code for the app and routing (`App.server.jsx`)
- The Hydrogen app's two entry points, which are based on environment:

  - **Server**: `entry-server.jsx`
  - **Client**: `entry-client.jsx`

- Basic styles provided by Tailwind CSS (`index.css`)

{% codeblock file, filename: "File structure of the Hydrogen starter template" %}

```
└── src
    ├── components
        └── Button.client.jsx
        └── Cart.client.jsx
        └── CartIcon.client.jsx
        └── ...
    ├── pages
        └── collections
            └── [handle].server.jsx
        └── pages
            └── [handle].server.jsx
        └── products
            └── [handle].server.jsx
        └── index.server.jsx
        └── sitemap.xml.server.jsx
    ├── App.server.jsx
    ├── entry-client.jsx
    ├── entry-server.jsx
    ├── index.css
```

{% endcodeblock %}

## Request workflow for Hydrogen apps

The following diagram shows the request workflow for Hydrogen apps, based on the platform where Hydrogen is being hosted:

![A diagram that illustrates the request workflow for Hydrogen apps, based on the platform where Hydrogen is being hosted](/assets/custom-storefronts/hydrogen/hydrogen-server-entry-points.png)

### Node.js runtime

The Hydrogen app is hosted on a Node.js platform (for example, Heroku, Vercel, or Netlify). Optionally, a Docker container can be used (for example, GCP, AWS, Azure, or Fly.io). The app uses `server.js` and a Vite development server for server-side rendering, and `Node.js` middleware.

### Worker (v8) runtime

The Hydrogen app is hosted on a worker platform (for example, Oxygen or Cloudflare). The app uses `worker.js` for server-side rendering. The Cache API and KV API are powered by Oxygen, Cloudflare, or another runtime adapter.

## Next steps

- Learn about [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components), an opinionated data-fetching and rendering workflow for React apps.
