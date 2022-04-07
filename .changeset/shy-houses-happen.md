---
'template-hydrogen-default': minor
'@shopify/hydrogen': minor
---

Analytics instrumentation - this provides intergration points for both server
and client side analytics instrumentations

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
// components/AnalyticsListener.client.jsx
import {ClientAnalytics} from '@shopify/hydrogen/client';

export default function AnalyticsListener() {
  useEffect(() => {
    // Make sure the `useEffect` dependency parameter is undefined so that
    // `ClientAnalytics.subscribe` only execute once
    ClientAnalytics.subscribe(
      ClientAnalytics.eventNames.PAGE_VIEW,
      (payload) => {
        console.log(payload);
      }
    );
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

In order to send analytics from server-side, you need to make a fetch request to
the `__event` endpoint. For example:

```jsx
// components/AnalyticsListener.client.jsx
import {ClientAnalytics} from '@shopify/hydrogen/client';

export default function AnalyticsListener() {
  useEffect(() => {
    // ClientAnalytics must be inside a `useEffect` to work properly
    // Make sure the `useEffect` dependency parameter is undefined so that
    // `ClientAnalytics.subscribe` only execute once
    ClientAnalytics.subscribe(ClientAnalytics.eventNames.PAGE_VIEW, (payload) =>
      ClientAnalytics.pushToServer(payload)
    );
  });

  return null;
}
```

Create a server analytics connector.

```jsx
// components/MyServerAnalyticsListener.server.jsx
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
import * as MyServerAnalyticsConnector from '/components/MyServerAnalyticsConnector.server.jsx'

...

export default renderHydrogen(App, {
  shopifyConfig,
  routes,
  serverAnalyticsConnectors: [MyServerAnalyticsConnector]
});
```
