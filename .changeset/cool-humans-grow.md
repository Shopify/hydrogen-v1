---
'@shopify/hydrogen': patch
---

Whenever using `fetchSync`, make sure to handle the error state. Though we've made changes to the error thrown by the JSON parser to also tell you that the request failed:

```ts
function MyComponent() {
  const response = fetchSync('/api');

  // Make sure the error state is handled!
  if (!response.ok) {
    console.error(
      `Unable to load ${response.url} returned ${response.status}`,
    );
    return <div>Error. Please try again</div>;
  }

  // Check `response.ok` before parsing the response
  const json = response.json();

  return ...
```
