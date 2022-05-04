---
gid: 877e526b-8462-4d2d-ac4e-45bd482f6962
title: log
description: The log utility is a function that's used for logging debugging, warning, and error information about the application.
---

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

## Arguments

None

## Return type

Return an object with methods for logging information at different priorities:

| Log method    | Description                                                                       |
| ------------- | --------------------------------------------------------------------------------- |
| `log.trace()` | The lowest priority logs. These logs are very verbose.                            |
| `log.debug()` | The normal priority logs. Used internally for logging route timing information.   |
| `log.warn()`  | The high priority warnings that might or might not cause the application to fail. |
| `log.error()` | The logging used for errors or invalid application state.                         |
| `log.fatal()` | The logging used just prior to the process exiting.                               |

## Logger options

Logger has the following Boolean options:

| Option                      | Description                                                                     |
| --------------------------- | ------------------------------------------------------------------------------- |
| `showCacheApiStatus`        | Logs the cache status of each stored entry: `PUT`, `HIT`, `MISS` or `STALE`.    |
| `showCacheControlHeader`    | Logs the cache control headers of the main document and its sub queries.        |
| `showQueryTiming`           | Logs the timeline of when queries are being requested, resolved, and rendered.  |
| `showUnusedQueryProperties` | Logs warnings in your app if you're over-fetching data from the Storefront API. |

### Example

```js
import {setLoggerOptions} from '@shopify/hydrogen';

setLoggerOptions({
  showCacheApiStatus: true,
  showCacheControlHeader: true,
  showQueryTiming: true,
  showUnusedQueryProperties: true,
});
```

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
});
```
