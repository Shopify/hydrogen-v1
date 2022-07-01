---
'@shopify/hydrogen': minor
---

Expose utilities for integrating Hydrogen with 3rd party platforms in `@shopify/hydrogen/platforms`. These utilities can resolve the project build path automatically and also find the client build assets.

```js
import {
  handleRequest, // Instead of './src/App.server'
  indexTemplate, // Instead of './dist/client/index.html?raw'
  isAsset, // Access a list of files in './dist/client/**/*'
} from '@shopify/hydrogen/platforms';

// Platform entry handler
export default function (request) {
  if (isAsset(new URL(request.url).pathname)) {
    return platformAssetHandler(request);
  }

  return handleRequest(request, {indexTemplate});
}
```

Note that user apps don't need to be changed.
