## Logger options

Logger has the following Boolean options:

| Option                   | Description                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------- |
| `showCacheApiStatus`     | Logs the cache status of each stored entry: `PUT`, `HIT`, `MISS` or `STALE`.          |
| `showCacheControlHeader` | Logs the cache control headers of the main document and its sub queries.              |
| `showQueryTiming`        | Logs the timeline of when queries are being loaded, requested, fetched, and rendered. |

### Example

```js
import renderHydrogen from '@shopify/hydrogen/entry-server';
import {setLoggerOptions} from '@shopify/hydrogen';
import App from './App.server';

setLoggerOptions({
  showCacheApiStatus: true,
  showCacheControlHeader: true,
});

export default renderHydrogen(App, () => {
  // Custom hook
});
```
