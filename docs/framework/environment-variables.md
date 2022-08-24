---
gid: ab388044-3f55-4914-b1a6-51c75580ed2f
title: Environment variables
description: Learn how to store sensitive information in your Hydrogen project.
---

Environment variables, also known as secrets, allow you to load different values in your app depending on the running environment. This guide describes how to store environment variables in your Hydrogen project.

> Note:
> In the following examples, environment variables are stored in `Oxygen.env`. If you're not deploying to Oxygen, then you can choose a different storage location.

## How environment variables work

You can [store secrets and private variables in `.env` files](https://vitejs.dev/guide/env-and-mode.html#env-files) in your Hydrogen project:

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

## Public variables

In Hydrogen, variables that are prefixed with `PUBLIC_` in `.env` files are treated as public and are available in the browser and client.

Public variables are commonly used in client components, but they can be used anywhere.

Only public variables can be exposed to the client.

> Caution:
> Store only non-sensitive data in public variables. Public variables are added to the bundle code at build time as strings.

These variables can be accessed using Vite's [`import.meta.env`](https://vitejs.dev/guide/env-and-mode.html) object in any component:

{% codeblock file, filename: 'Component.client.jsx' %}

```js
export default Component() {
  const url = import.meta.env.PUBLIC_MY_API_URL;
  // import.meta.env.MY_SECRET_API_TOKEN is undefined
  // ...
}
```

{% endcodeblock %}

## Private variables

In Hydrogen, variables that are prefixed with `PRIVATE` in the `.env` file are treated as a server runtime variable in non-production environments.

Private variables are only available in components that run exclusively in the server or in utilities that are imported by those components.

These variables aren't exposed to the browser and server components can only access them from the Hydrogen configuration:

{% codeblock file, filename: 'hydrogen.config.ts' %}

```tsx
export default defineConfig({
  privateStorefrontToken:
    Oxygen?.env?.PRIVATE_SHOPIFY_STOREFRONT_API_TOKEN,
});
```
{% endcodeblock %}

### Private variables in production

> Caution:
> [Avoid rate-limiting in production](#use-storefront-api-server-tokens) by storing Storefront API server tokens in private variables.

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
> If you use private variables in client components, then they'll only work during server-side rendering and will fail to hydrate later in the browser.

### Use Storefront API server tokens

Prevent rate-limiting on server requests to the Storefront API by storing server tokens as private variables.

You need to authenticate server requests to the Storefront API with a [delegate access token](/apps/auth/oauth/delegate-access-tokens) that's stored in a private variable (`PRIVATE_SHOPIFY_STOREFRONT_API_TOKEN`) and referenced in the [Hydrogen configuration](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config):

{% codeblock file, filename: 'hydrogen.config.ts' %}

```tsx
export default defineConfig({
  privateStorefrontToken:
    Oxygen?.env?.PRIVATE_SHOPIFY_STOREFRONT_API_TOKEN,
});
```

{% endcodeblock %}

With public access, your requests are [throttled](/api/storefront#authentication) by the IP that the request is from. Requests from the server are made from a single IP. If these requests use a public access token, then they might be throttled due to the volume of requests. Because private variables aren't visible on the browser or client, they aren't subject to the same security controls as public tokens such as rate limiting.

You only need one delegate access token for a custom storefront, unless you need to rotate the token or change the access scopes available to the token.

## Next steps

- Learn how to [deploy your Hydrogen storefront](https://shopify.dev/custom-storefronts/hydrogen/deployment) to Oxygen and other runtimes.
