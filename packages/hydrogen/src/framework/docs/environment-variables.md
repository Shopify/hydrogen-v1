Environment variables, also known as secrets, allow you to load different values in your app depending on the running environment. This guide describes how to store environment variables in your Hydrogen project.

## How environment variables work

You can store secrets in `.env` files in your project, as per [Vite's guide](https://vitejs.dev/guide/env-and-mode.html#env-files):

{% codeblock file, filename: '.env' %}

```
PUBLIC_MY_API_URL="example.com"

MY_SECRET_API_TOKEN="topsecret"
```

{% endcodeblock %}

### Public variables

In Hydrogen, environment variables prefixed with `PUBLIC_` in the `.env` files are treated as public and are available in the browser. These variables can be accessed using Vite's `import.meta.env` in any component.

### Private variables

Any variable from `.env` files that isn't prefixed with `PUBLIC_` is treated as a server runtime variable in non-production environments. These variables are not exposed to the browser and can only be accessed from server components using the global `Oxygen.env` object.

In production, however, none of the `.env` files will be used to load runtime variables by default. Instead, loading variables will vary based on the hosting runtime you're using. For example, when deploying to a Node.js server, pass your variables to the Node.js process and create a global `Oxygen` object based on that: `globalThis.Oxygen = {env: process.env};`.

## Next steps

- Learn how to manage the [state on the server](/custom-storefronts/hydrogen/framework/server-state) as you're building your Hydrogen app.
- Get familiar with the [file-based routing system](/custom-storefronts/hydrogen/framework/routes) that Hydrogen uses.
- Learn how the [page server component](/custom-storefronts/hydrogen/framework/pages) receives props, which includes custom versions of `request` and `response`.
