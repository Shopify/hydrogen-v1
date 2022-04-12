---
'@shopify/hydrogen': patch
---

Ability to concatenate requests in API route handlers without leaving the server by returning a new Request instance.

```jsx
// src/routes/my-page.server.jsx

export async function api(request) {
  if (request.method === 'POST') {
    // do some work here...
  }

  return new Request(request.url, {method: 'GET'});
}

export default function Page() {
  return (
    <form action="/my-page" method="POST">
      ...
    </form>
  );
}
```

In the previous example, a POST request to `/my-page` would run the API handler and automatically continue with the server component rendering (GET). This is useful for handling HTML forms without waterfall requests.
