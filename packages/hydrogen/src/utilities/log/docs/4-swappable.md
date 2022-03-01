## Swap logger implementation

Hydrogen includes a default logger implementation that can be swapped for a logger of your choice. You can call `setLogger` with your own implementation. The first argument of each log method will contain a `request` object if the log was called in the same context as a request:

```js
import {setLogger} from '@shopify/hydrogen';

setLogger({
  trace(request, ...args) {
    // Call your own logger.
  },
  debug(request, ...args) {
    // Call your own logger.
  },
  warn(request, ...args) {
    // Call your own logger.
  },
  error(request, ...args) {
    // Call your own logger.
  },
  fatal(request, ...args) {
    // Call your own logger.
  },
  options: () => ({
    showCacheApiStatus: true,
    showCacheControlHeader: true,
  }),
});
```
