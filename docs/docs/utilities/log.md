# log


The `log` utility is a function that's used for logging debugging, warning, and error information about the application. Use this utility by importing `log` from `@shopify/hydrogen`, or by using a `log` prop passed to each page component. We recommend using the `log` prop passed to each page because it will associate your log to the current request in progress.

## Example code

```tsx
import {log} from '@shopify/hydrogen';

log.debug('app started'); // Statically log some information.

export default function Product({country = {isoCode: 'US'}, log}) {
  // A log object is passed to each page component.
  // Use if you want your log to have the current request contextually included.
  log.trace('product detail page rendered');

  return <h1>Product Detail page</h1>;
}
```

## Methods

The `log` utility exposes the following methods for logging information at different priorities:

| Log method    | Description                                                                       |
| ------------- | --------------------------------------------------------------------------------- |
| `log.trace()` | The lowest priority logs. These logs are very verbose.                            |
| `log.debug()` | The normal priority logs. Used internally for logging route timing information.   |
| `log.warn()`  | The high priority warnings that might or might not cause the application to fail. |
| `log.error()` | The logging used for errors or invalid application state.                         |
| `log.fatal()` | The logging used just prior to the process exiting.                               |

## Swap logger implementation and options

Hydrogen includes a default logger implementation that can be swapped for a logger of your choice. You can also show debugging information for cache and queries by providing extra options. For more information, refer to [Hydrogen configuration](https://shopify.dev/custom-storefronts/hydrogen/configuration#logger).

