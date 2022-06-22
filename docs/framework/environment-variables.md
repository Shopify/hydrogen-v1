---
gid: ab388044-3f55-4914-b1a6-51c75580ed2f
title: Environment variables
description: Learn how to store sensitive information in your Hydrogen project.
---

Environment variables, also known as secrets, allow you to load different values in your app depending on the running environment. This guide describes how to store environment variables in your Hydrogen project.

## How environment variables work

You can [store secrets in `.env` files](https://vitejs.dev/guide/env-and-mode.html#env-files) in your Hydrogen project:

{% codeblock file, filename: '.env' %}

```
PUBLIC_MY_API_URL="example.com"

MY_SECRET_API_TOKEN="topsecret"
```

{% endcodeblock %}

### Files for specific environments

Hydrogen supports files for specific environments. For example, you might have the following files that map to different environments:

- **Development environment**: `.env.development`
- **Staging environment**: `.env.staging`
- **Production environment**: `.env.production`

The file that Hydrogen uses is determined by the running [Vite mode](https://vitejs.dev/guide/env-and-mode.html#modes). For example, if you're running a development server, then `.env.development` overrides `.env`.

### Public variables

In Hydrogen, environment variables that are prefixed with `PUBLIC_` in `.env` files are treated as public and are available in the browser. These variables can be accessed using Vite's [`import.meta.env`](https://vitejs.dev/guide/env-and-mode.html) object in any component:

{% codeblock file, filename: 'Component.client.jsx' %}

```js
export default Component() {
  const url = import.meta.env.PUBLIC_MY_API_URL;
  // import.meta.env.MY_SECRET_API_TOKEN is undefined
  // ...
}
```

{% endcodeblock %}

> Caution:
> Public variables are added to the bundle code at build time as strings. As a result, you should only store non-sensitive data in these variables. Public variables are commonly used in client components, but they can be used anywhere.

### Private variables

In Hydrogen, any variable from `.env` files that isn't prefixed with `PUBLIC_` is treated as a server runtime variable in non-production environments. These variables aren't exposed to the browser and can only be accessed from server components using the global `Oxygen.env` object:

{% codeblock file, filename: 'Page.server.jsx' %}

```
export default Page() {
  const token = Oxygen.env.MY_SECRET_API_TOKEN

  // ...
}
```

{% endcodeblock %}

### Private variables in production

In production, none of the `.env` files are used to load runtime variables by default. Instead, the variables that load are based on the hosting runtime that you're using.

For example, if you're deploying to a Node.js server, then you can pass variables to the Node.js process using [`cross-env`](https://github.com/kentcdodds/cross-env#readme):

{% codeblock file, filename: 'server.js' %}

```js
cross-env MY_SECRET=... node dist/server
```

{% endcodeblock %}

If you're using `@shopify/hydrogen/platforms/*` as the server build entry point, then the global `Oxygen` object is populated automatically. However, if you're using a custom entry point, then you must create this object manually.

The following example shows how to manually create the global `Oxygen` object in a custom Node.js server entry file:

{% codeblock file, filename: 'server.js' %}

```js
const app = /* Custom server such as Express or Fastify */;
globalThis.Oxygen = {env: process.env};
app.use(hydrogenMiddleware({/* ... */}))
```

{% endcodeblock %}

> Caution:
> If you use private variables in client components, then they'll only work during server-side rendering and will fail to hydrate later in the browser. Private variables are only available in components that run exclusively in the server or in utilities that are imported by those components.

## Next steps

- Learn how to [deploy your Hydrogen storefront](https://shopify.dev/custom-storefronts/hydrogen/deployment) to Oxygen and other runtimes.
