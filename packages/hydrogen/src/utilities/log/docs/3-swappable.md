## Swap logger implementation

Hydrogen includes a default logger implementation that can be swapped for a logger of your choice. You can call `setLogger` with your own implementation.
The first argument of each log method will contain a `request` object if the log was called in the same context as a request:

```js
import renderHydrogen from '@shopify/hydrogen/entry-server';
import {setLogger} from '@shopify/hydrogen';
import App from './App.server';

setLogger({
  trace({request}, ...args) {
    // call your own logger
  },
  debug({request}, ...args) {
    // call your own logger
  },
  warn({request}, ...args) {
    // call your own logger
  },
  error({request}, ...args) {
    // call your own logger
  },
  fatal({request}, ...args) {
    // call your own logger
  },
});

export default renderHydrogen(App, () => {
  // Custom hook
});
```
