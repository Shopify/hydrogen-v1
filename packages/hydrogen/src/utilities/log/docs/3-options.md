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
