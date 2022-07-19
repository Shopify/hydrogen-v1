---
'@shopify/hydrogen': minor
---

Add support for custom 500 error pages. If an unexpected error occurs while rendering a route, Hydrogen will respond with a 500 HTTP error and render a default error page. You can customize that page by adding a `Error.client.jsx` component within your `src` directory:

```tsx
export default function Error({error}) {
  return (
    <div>
      <h1>An unknown error occured!</h1>
      <h2>{error.message}</h2>
      <h3>{error.stack}</h3>
    </div>
  );
}
```
