---
gid: b54e4a9f-a6e0-4ec4-a64f-059b0be3ab22
title: Configure default entry points
description: Learn how to configure the default client and server entry points for your Hydrogen app.
---

> ⚠️ **Important:** [Hydrogen 2.0](https://hydrogen.shopify.dev) is out now. These archival docs are provided only to assist developers during their upgrade process. Please migrate to Hydrogen 2.0 as soon as possible.


{% include /hydrogen/default-entry-points.md %}

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
