Environment variables, also known as secrets, allow you to load different values in your app depending on the running environment. This guide describes how to store environment variables in your Hydrogen project.

## How environment variables work

You can store secrets in `.env` files in your project, as per [Vite's guide](https://vitejs.dev/guide/env-and-mode.html#env-files):

{% codeblock file, filename: '.env' %}

```
PUBLIC_MY_API_URL="example.com"

MY_SECRET_API_TOKEN="topsecret"
```

Files for specific environments are also supported, such as `.env.development`, `.env.staging` or `.env.production`. The file used will be determined by the running [Vite mode](https://vitejs.dev/guide/env-and-mode.html#modes). For example, when running the development server, `.env.development` variables will override `.env`.

{% endcodeblock %}

### Public variables

In Hydrogen, environment variables prefixed with `PUBLIC_` in the `.env` files are treated as public and are available in the browser. These variables can be accessed using Vite's `import.meta.env` in any component.

{% codeblock file, filename: 'Component.client.jsx' %}

```
export default Component() {
  const url = import.meta.env.PUBLIC_MY_API_URL;
  // import.meta.env.MY_SECRET_API_TOKEN is undefined

  // ...
}
```

{% endcodeblock %}

Note that public variables are inlined in the bundle code at build time as strings. Therefore, use these variables only for non-sensitive data. Its usage is common in client components, although they can be used anywhere.

### Private variables

Any variable from `.env` files that isn't prefixed with `PUBLIC_` is treated as a server runtime variable in non-production environments. These variables are not exposed to the browser and can only be accessed from server components using the global `Oxygen.env` object.

{% codeblock file, filename: 'Page.server.jsx' %}

```
export default Page() {
  const token = Oxygen.env.MY_SECRET_API_TOKEN

  // ...
}
```

{% endcodeblock %}

In production, however, none of the `.env` files will be used to load runtime variables by default. Instead, loading variables will vary based on the hosting runtime you're using. For example, when deploying to a Node.js server, you can pass your variables to the Node.js process using [`cross-env`](https://github.com/kentcdodds/cross-env#readme): `cross-env MY_SECRET=... node dist/server`.

When using `@shopify/hydrogen/platforms/*` as the server build entry point, the global `Oxygen` object will be populated automatically. However, if you are using a custom entry point, you must create this object manually. For example, in a custom Node.js server entry file:

{% codeblock file, filename: 'server.js' %}

```
const app = /* custom server such as Express, Fastify, etc. */;

globalThis.Oxygen = {env: process.env};

app.use(hydrogenMiddleware({/* ... */}))

```

{% endcodeblock %}

Private variables are only available in components that run exclusively in the server. In other words, they are common in server components or utilities imported by them. Beware that, when used in client components, it will only work during server side rendering and then fail to hydrate later in the browser.

## Next steps

- Learn how to manage the [state on the server](/custom-storefronts/hydrogen/framework/server-state) as you're building your Hydrogen app.
- Get familiar with the [file-based routing system](/custom-storefronts/hydrogen/framework/routes) that Hydrogen uses.
- Learn how the [page server component](/custom-storefronts/hydrogen/framework/pages) receives props, which includes custom versions of `request` and `response`.
