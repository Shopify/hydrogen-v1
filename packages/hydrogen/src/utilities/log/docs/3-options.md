## Logger options

Logger has options to turn on/off certain log type informations:

| Log options              | Description                                                             |
| ------------------------ | ----------------------------------------------------------------------- |
| `showCacheApiStatus`     | Logs the cache status of each stored entries (PUT/HIT/MISS/STALE)       |
| `showCacheControlHeader` | Logs the cache control headers of the main document and its sub queries |

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
