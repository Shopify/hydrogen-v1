Third-party dependencies will generally work out-of-the-box with Hydrogen. This guide describes how to install third-party dependencies, where to insert them, and offers tips for troubleshooting dependencies.

## Install dependencies

To install third party dependencies, run the following command:

{% codeblock file, filename: 'Terminal' %}

```bash?filename: 'Terminal', title: 'yarn'
yarn add <dependency>
```

```bash?filename: 'Terminal', title: 'npm'
npm install <dependency>
```

{% endcodeblock %}

## Where to insert dependencies

Consider the following:

- If the dependency interacts with `useState` or browser APIs, then place it inside a `*.client.jsx` component. Follow the [rules of server and client components](/api/hydrogen/framework/react-server-components#rules-for-server-and-client-components).
- If the dependency is purely client-based, and you don't need to interact with it in individual components, then you can insert it in `src/entry-client.jsx`.
- If the dependency includes a style import from a CSS file, then you can import that in `src/entry-client.jsx`.

## Troubleshooting dependencies

When bundling third-party dependencies, you might see errors in development or production related to the incorrect bundle type being used from the package.

This happens because [Vite](https://vitejs.dev/) uses a heuristic to determine whether to load a module-based import (ESM) or a CommonJS-based import (CJS). Sometimes, the heuristic chooses the wrong version, or the third-party package formats their project in an unusual way.

To fix this, you can try adding the dependency to the `optimizeDeps.include` property of your `vite.config.js` file:

{% codeblock file, filename: 'vite.config.js' %}

```js
import {defineConfig} from 'vite';
import hydrogen from '@shopify/hydrogen/plugin';

import shopifyConfig from './shopify.config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [hydrogen(shopifyConfig)],

  optimizeDeps: {
    include: ['YOUR_DEPENDENCY'],
  },
});
```

{% endcodeblock %}

Similarly, if you find that a dependency is being optimized when it shouldn't, you can try adding the dependency to `optimizeDeps.exclude` to see if it fixes the issue.

## More help

- Learn more about dependency pre-bundling and optimization in [Vite](https://vitejs.dev/guide/dep-pre-bundling.html#dependency-pre-bundling).

- [Check this GitHub discussion](https://github.com/Shopify/hydrogen/discussions/603) to see if another developer has the same issue or report a new issue to Hydrogen maintainers.
