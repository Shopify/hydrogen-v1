---
'@shopify/hydrogen': minor
---

Add support for custom 500 error pages. If an unexpected error occurs while rendering a route, Hydrogen will respond with a 500 HTTP error and render a default error page. Define a custom error page with the `serverErrorPage` configuration property:

```tsx
import {defineConfig} from '@shopify/hydrogen/config';

export default defineConfig({
  ...
  serverErrorPage: '/src/Error.jsx',
});
```

The `serverErrorPage` property defaults to `/src/Error.{jsx,tsx}`. The custom error page is passed an `Error` property:

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
