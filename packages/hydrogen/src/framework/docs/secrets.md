Secrets are environment variables that contain sensitive information. This guide describes how to store secrets in your Hydrogen project.

## How secrets work

You can store secrets in a `.env` file in your project, as per [Vite's guide to secrets](https://vitejs.dev/guide/env-and-mode.html#env-files):

{% codeblock file, filename: 'secrets.env' %}
```
VITE_MY_API_SECRET=topsecret
```
{% endcodeblock %}

### Prefixing secret names

You need to prefix your secret names with `VITE_` for them to be displayed within your server components. However, as long as you only reference secrets using `import.meta.env` in your server components, your credentials won't be leaked to your client bundle.

## Next steps

- Learn how to manage the [state on the server](/api/hydrogen/framework/server-state) as you're building your Hydrogen app.
- Get familiar with the [file-based routing system](/api/hydrogen/framework/routes) that Hydrogen uses.
- Learn how the [page server component](/api/hydrogen/framework/pages) receives props, which includes custom versions of `request` and `response`.
