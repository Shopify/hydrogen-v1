---
gid: 922f748a-d0cc-4d97-b9b8-67adf9d22970
title: Change the configuration file location
description: Learn how to change the Hydrogen configuration file location.
---

> ⚠️ **Important:** [Hydrogen 2.0](https://hydrogen.shopify.dev) is out now. These archival docs are provided only to assist developers during their upgrade process. Please migrate to Hydrogen 2.0 as soon as possible.


If you don't want the Hydrogen configuration file located at the root of your project, then you can provide the new path to the file in the Hydrogen Vite plugin (`vite.config.js`):

{% codeblock file, filename: 'vite.config.js' %}

```tsx
import {defineConfig} from 'vite';
import hydrogen from '@shopify/hydrogen/plugin';

export default defineConfig({
  plugins: [hydrogen({configPath: '../../hydrogen.config.ts'})],
});
```

{% endcodeblock %}

> Note:
> The `configPath` property must be an absolute path to the Hydrogen configuration file or a relative path starting from the `vite.config.js` location.
