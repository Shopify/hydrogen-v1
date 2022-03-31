---
'template-hydrogen-default': minor
'@shopify/hydrogen': minor
---

Analytic instrumentation - this provides intergration points for both server
and client side analytic instrumentations

By default, Hydrogen will emit the following events:

- `page-view`
- On Cart API success
  - `add-to-cart`
  - `remove-from-cart`
  - `update-cart`
  - `discount-code-updated`

#### Client-side analytic

To listen for an analytics event, create a client component and subscribe to the desired event.

```jsx
// components/AnalyticListener.client.jsx
import {ClientAnalytics} from '@shopify/hydrogen/client';

let init = false;
export default function AnalyticsListener() {
  useEffect(() => {
    if (!init) {
      init = true;
      // ClientAnalytics must be inside a `useEffect` to work properly
      ClientAnalytics.subscribe(
        ClientAnalytics.eventNames.PAGE_VIEW,
        (payload) => {
          console.log(payload);
        }
      );
    }
  });

  return null;
}
```

Include the above client component in your `App.server.jsx`

```jsx
// App.server.jsx
function App({routes}) {
  return (
    <>
      <Suspense fallback={<LoadingFallback />}>...</Suspense>
      <AnalyticsListener />
    </>
  );
}
```

#### Server-side analytic

In order to send analytic from server-sde, you need to make a fetch to
the `__event` endpoint. For example:

```jsx
// components/AnalyticListener.client.jsx
import {ClientAnalytics} from '@shopify/hydrogen/client';

let init = false;
export default function AnalyticsListener() {
  useEffect(() => {
    if (!init) {
      init = true;
      // ClientAnalytics must be inside a `useEffect` to work properly
      ClientAnalytics.subscribe(
        ClientAnalytics.eventNames.PAGE_VIEW,
        (payload) => {
          fetch('/__event', {
            method: 'post',
            headers: {
              'cache-control': 'no-cache',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
        }
      );
    }
  });

  return null;
}
```

Create a server analytic connector.

```jsx
// components/ServerAnalyticsListener.server.jsx
export function request(
  request: Request,
  data?: any,
  contentType?: string
): void {
  console.log(data);
}
```

Include it in your `App.server.js`

```jsx
// App.server.js
import * as MyServerAnalyticConnector from '/components/MyServerAnalyticConnector.server.jsx'

...

export default renderHydrogen(App, {
  shopifyConfig,
  routes,
  serverAnalyticConnectors: [MyServerAnalyticConnector]
});
```
