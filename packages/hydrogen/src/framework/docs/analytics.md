Hydrogen includes support for analytics that give you insight into how customers are interacting with a custom storefront.

This guide describes the analytic events that Hydrogen emits by default. It also explains how to subscribe to events, configure custom events, send analytic data from the server side, and unsubscribe from events.

## Default analytic events

By default, Hydrogen emits the following analytic events:

- `page-view`: When a customer visits a storefront page
- `add-to-cart`: When a customer adds an item to their cart
- `update-cart`: When a customer updates an item in their cart
- `remove-from-cart`: When a customer removes an item from their cart
- `discount-code-updated`: When a discount code that a customer applies to a cart is updated

## Subscribe to an analytic event

You can subscribe to an analytic event to allow your Hydrogen app to listen for the event. The following steps describe how to subscribe to the `page-view` analytic event.

1. Create a new client component in the `/components` directory of your Hydrogen app. For example, `components/AnalyticListener.client.jsx`.

2. In your client component, add the following code to subscribe to the analytic event:

   {% codeblock file, filename: 'components/AnalyticListener.client.jsx' %}

   ```js
   import {ClientAnalytics} from '@shopify/hydrogen/client';

   let init = false;
   export default function AnalyticsListener() {
     if (!init) {
       ClientAnalytics.subscribe('page-view', (payload) => {
         console.log(payload);
       });
       init = true;
     }

     return null;
   }
   ```

   {% endcodeblock %}

3. Add your client component to `App.server.jsx`, the main app component:

   {% codeblock file, filename: 'App.server.jsx' %}

   ```js
   function App({routes}) {
     return (
       <>
         <Suspense fallback={<LoadingFallback />}>...</Suspense>
         <AnalyticsListener />
       </>
     );
   }
   ```

   {% endcodeblock %}

## Configure a custom analytic event

Aside from the [default analytic events](#default-analytic-events) that Hydrogen supports, you can also configure custom analytic events. For example, you might have a promotional banner that displays on multiple pages.

The following example shows how to configure a custom event to track the pages where a promotional banner is being clicked the most:

{% codeblock file, filename: 'components/CustomAnalyticListener.client.jsx' %}

```js
<Banner onClick={(event) => {
  ClientAnalytics.publish('select_promotion', {
    creative_name: "Summer Banner",
    creative_slot: "featured_app_1",
    ...
  })
}}
```

{% endcodeblock %}

### Retrieving data from other parts of your Hydrogen app

You might need data that's available elsewhere in your Hydrogen app. For example, the data you need might be available in other server and client components:

{% codeblock file, filename: '*.server.js' %}

```js
useServerDatalayer({locale});
```

{% endcodeblock %}

{% codeblock file, filename: '*.client.js' %}

```js
// some.client.jsx
ClientAnalytics.pushToDataLayer({
  heroBanner: 'hero-1',
});
```

{% endcodeblock %}

To retrieve the data that's available elsewhere in your Hydrogen app, you can add the following code to your server and client components:

{% codeblock file, filename: '*.server.js' %}

```js
const serverDataLayer = useServerDatalayer();
```

{% endcodeblock %}

{% codeblock file, filename: '*.client.js' %}

```js
ClientAnalytics.getDataLayer();
```

{% endcodeblock %}

## Send analytic data from the server side

All events that are configured in client components are sent to the server using the `/__event` endpoint. You can listen to the `/__event` endpoint on the server side by supplying a server analytic connector:

{% codeblock file, filename: 'MyServerAnalyticConnector.jsx' %}

```js
export function request(request: Request): void {
  Promise.resolve(request.json())
    .then((data) => {
      if (data.eventname) {
        console.log(data.eventname, data.payload);
      }
    })
    .catch((error) => {
      log.warn('Failed to resolve server analytics: ', error);
    });
}
```

{% endcodeblock %}

{% codeblock file, filename: 'App.server.js' %}

```js
import * as MyServerAnalyticConnector from '/components/MyServerAnalyticConnector.jsx'

...

export default renderHydrogen(App, {
  shopifyConfig,
  routes,
  serverAnalyticConnectors: [MyServerAnalyticConnector]
});
```

{% endcodeblock %}

## Unsubscribe from an analytic event

You can unsubscribe from analytic events that you no longer want your Hydrogen app to track. For example, you can unsubscribe from the `page-view` event:

{% codeblock file, filename: 'components/AnalyticListener.client.jsx' %}

```js
const pageViewSubscriber = ClientAnalytics.subscribe('page-view', (payload) => {
  console.log(payload);
});
...
// Some condition is met
pageViewSubscriber.unsubscribe();
```

{% endcodeblock %}

## Next steps

- Learn about [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components), an opinionated data-fetching and rendering workflow for React apps.
- Learn how to customize the output of [SEO-related tags](/custom-storefronts/hydrogen/framework/seo) in your Hydrogen client and server components.
