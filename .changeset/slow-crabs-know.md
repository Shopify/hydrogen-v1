---
'@shopify/hydrogen': patch
---

Adds new `load-config` entry point that exposes a `loadConfig()` function that will return the configuration object and the path to the found configuration file for a given Hydrogen project root.

Example:

```ts
import {loadConfig} from '@shopify/hydrogen/load-config';

const {configuration, configurationPath} = await loadConfig({
  root: 'path/to/hydrogen-app',
});
```
