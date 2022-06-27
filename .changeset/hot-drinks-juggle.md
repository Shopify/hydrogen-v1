---
'@shopify/hydrogen': patch
---

The payload returned by `fetchSync` was supposed to mimic `react-fetch` but it wrongly moved the Response data to a sub-property `response`. This has been fixed to have the Response at the top level. Also, cached responses are now correctly serialized and retrieved to avoid issues on cache hit.

```diff
const response = fetchSync('...');
-response.response.headers.get('...');
+response.headers.get('...');
const jsonData = response.json();
```

Note that the sub-property `response` is still available but marked as deprecated.
