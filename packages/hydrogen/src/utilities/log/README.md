<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/utilities/isServer and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

A utility for logging debugging, warning, and error information about the application.
Use by importing `log` `@shopify/hydrogen` or by using a `log` prop passed to each page
component. Using the latter is ideal, because it will ty your log to the current request in progress.## Example code

```tsx
import {log} from '@shopify/hydrogen';

log.debug('app started'); // Statically log some information

export default function Product({country = {isoCode: 'US'}, log}) {
  // A log object is passed to each page component.
  // Use if you want your log to have the current request contextually included
  log.trace('product detail page rendered');

  return <h1>Product Detail page</h1>;
}
```

## Arguments

None

## Return type

Return an object with methods for logging information at different priorities:

| Log method    | Priority                                                                       |
| ------------- | ------------------------------------------------------------------------------ |
| `log.trace()` | Lowest priority and very verbose.                                              |
| `log.debug()` | Normal logging priority. Used internally for logging route timing information. |
| `log.warn()`  | High priority warnings, that may or may not cause the application to fail.     |
| `log.error()` | Use for errors or invalid application state                                    |
| `log.fatal()` | Intended to be used just prior to the process exiting                          |

## Swap logger implementation

Hydrogen includes a default logger implementation that can be swapped for a logger of your choice. Simply call `setLogger` with your own implementation.
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
