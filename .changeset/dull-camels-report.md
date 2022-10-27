---
'@shopify/hydrogen': minor
---

Remove automatic origin support from `fetchSync` on the server.

Developers should never be making `fetch` requests on the server against their own Hydrogen app. This is because some production runtimes prohibit invoking `fetch` requests to servers in the same region. Other runtimes will fail to resolve DNS when invoked from within the same process.

This change makes it **required** to pass a fully-qualified URL (including origin) to `fetchSync` when it's being used on the server:

```jsx
// MyComponent.server.jsx

// ❌ You should not use this pattern, and it will now fail:
fetchSync('/api/path').json();
```

Instead, you should query the data directly, or extract the data query to a function and call it inside your server component:

```jsx
// MyComponent.server.jsx
import {sharedQuery} from './shared-location.server';

// ✅ Do this instead:
useQuery('shared-query', sharedQuery);
```

This is not considered a breaking change because the intention of the server-side `fetchSync` API was never to enable calling a Hydrogen app from itself, but rather to call third-party APIs from the server.
