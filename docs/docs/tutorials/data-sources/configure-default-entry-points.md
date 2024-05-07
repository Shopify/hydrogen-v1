# Configure default entry points


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



Hydrogen includes the following default entry points for your app:

- **Client entry point**: [`@shopify/hydrogen/entry-client`](https://github.com/Shopify/hydrogen/blob/main/packages/hydrogen/src/entry-client.tsx), which is included in [`index.html`](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/index.html) and used for hydration purposes
- **Server entry point**: [`App.server.jsx`](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/App.server.jsx)

You can configure the default entry points for your app.
### Change the client entry point

If you need to change the client entry point, then create a new file such as `src/entry-client.jsx` with the following code and update the path in `index.html`:

```jsx
// src/entry-client.jsx

import renderHydrogen from '@shopify/hydrogen/entry-client';

const ClientWrapper = (props) => props.children;

export default renderHydrogen(ClientWrapper);
```



```html
<!-- index.html -->

<script type="module" src="/src/entry-client"></script>
```



### Change the server entry point

If you need to change the server entry point, then make the following updates in the `package.json` file:

- **Development**: Pass a `HYDROGEN_SERVER_ENTRY` environment variable to the development command.
- **Production**: Use a `--ssr` flag when building your app.

```json
// package.json

"scripts": {
  "dev": "HYDROGEN_SERVER_ENTRY=/my/path/MyApp.server vite",
  ...
  "build:server": "vite build --ssr /my/path/MyApp.server",
  ...
},
```


