# Change the configuration file location


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



If you don't want the Hydrogen configuration file located at the root of your project, then you can provide the new path to the file in the Hydrogen Vite plugin (`vite.config.js`):

```tsx
// vite.config.js

import {defineConfig} from 'vite';
import hydrogen from '@shopify/hydrogen/plugin';

export default defineConfig({
  plugins: [hydrogen({configPath: '../../hydrogen.config.ts'})],
});
```



> Note:
> The `configPath` property must be an absolute path to the Hydrogen configuration file or a relative path starting from the `vite.config.js` location.
