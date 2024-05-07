# Third-party dependencies


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



Third-party dependencies will generally work out-of-the-box with Hydrogen. This guide describes how to install third-party dependencies, where to insert them, and offers tips for troubleshooting dependencies.

## Installation

To install third party dependencies, run the following command:

```bash?title: 'npm'

npm install <dependency>
```

```bash?title: 'Yarn'
yarn add <dependency>
```



## Where to insert dependencies

Consider the following:

- If the dependency interacts with `useState` or browser APIs, then place it inside a `*.client.jsx` component. Follow the [rules of server and client components](/tutorials/react-server-components/index.md#constraints).
- If the dependency is purely client-based, and you don't need to interact with it in individual components, then you can insert it in the `<head>` element of `index.html`.
- If the dependency includes a style import from a CSS file, then you can import that in the `<head>` element of `index.html`.

## Troubleshooting dependencies

This section provides strategies for troubleshooting third-party dependencies in your Hydrogen project.

### Updating Vite dependencies

[Vite](https://vitejs.dev/) caches pre-bundled dependencies in `node_modules/.vite`. It re-runs the pre-bundling step if any of the following changes occur:

- The dependencies list is updated in `package.json`
- Package manager lockfiles (for example `yarn.lock`) are updated
- Any fields in `vite.config.js` are updated

You can force Vite to re-bundle dependencies by completing one of the following tasks:

- Start the dev server with the `--force` command line option
- Manually delete the `node_modules/.vite` cache directory

### Bundling third-party dependencies

When bundling third-party dependencies, you might see errors in development or production related to the incorrect bundle type being used from the package.

This happens because [Vite](https://vitejs.dev/) uses a heuristic to determine whether to load a module-based import (ESM) or a CommonJS-based import (CJS). Sometimes, the heuristic chooses the wrong version, or the third-party package formats their project in an unusual way.

To fix this, you can try adding the dependency to the `optimizeDeps.include` property of your `vite.config.js` file:

```js
// vite.config.js

import {defineConfig} from 'vite';
import hydrogen from '@shopify/hydrogen/plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [hydrogen()],

  optimizeDeps: {
    include: ['YOUR_DEPENDENCY'],
  },
});
```



> Tip:
> If you find that a dependency is being optimized when it shouldn't, then you can try adding the dependency to `optimizeDeps.exclude` to see if it fixes the issue.

## Next steps

- Learn more about dependency pre-bundling and optimization in [Vite](https://vitejs.dev/guide/dep-pre-bundling.html#dependency-pre-bundling).
- [Check the Hydrogen GitHub discussion](https://github.com/Shopify/hydrogen/discussions/93) for your issue, or report a new issue to Hydrogen maintainers.
