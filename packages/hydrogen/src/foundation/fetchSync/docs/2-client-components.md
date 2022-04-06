## `fetchSync` in client components

If you're using `fetchSync` in a client component, make sure to import the function from `@shopify/hydrogen/client`. You can't provide options for caching and preloading in client components:

{% codeblock file, filename: "MyComponent.client.js" %}

```jsx
import {fetchSync} from '@shopify/hydrogen/client';
import {Suspense} from 'react';
export function MyComponent() {
  return (
    <Suspense fallback="Loading...">
      <MyThings />
    </Suspense>
  );
}
function MyThings() {
  const things = fetchSync('https://3p.api.com/things.json').json();
  return <h2>{things.title}</h2>;
}
```

{% endcodeblock %}

### Arguments

The `fetchSync` hook takes the following arguments:

| Key           | Required | Description                                              |
| ------------- | -------- | -------------------------------------------------------- |
| `string`      | Yes      | A URL to fetch.                                          |
| `requestInit` | No       | The options to manage the fetch behavior of the request. |

The `requestInit` object mirrors the [`init` properties available in the Web Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request).

### Return value

The `fetchSync` function returns an object with the following keys:

| Key        | Description                                                                             |
| ---------- | --------------------------------------------------------------------------------------- |
| `response` | The Response returned by the fetch call. Useful for checking status code, headers, etc. |
| `json()`   | A function to return a JavaScript object based on the JSON response body.               |
| `text()`   | A function to return a string version of the response body.                             |
