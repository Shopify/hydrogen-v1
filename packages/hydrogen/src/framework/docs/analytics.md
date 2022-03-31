Hydrogen includes support for analytics that give you insight into how customers are interacting with a custom storefront.

This guide describes the analytic events that Hydrogen emits by default. It also explains how to subscribe to events, configure custom events, send analytic data from the server side, and unsubscribe from events.

## Default analytic events

By default, Hydrogen emits the following analytic events:

- `PAGE_VIEW`: When a customer visits a storefront page
- `ADD_TOCART`: When a customer adds an item to their cart
- `UPDATE_CART`: When a customer updates an item in their cart
- `REMOVE_FROM_CART`: When a customer removes an item from their cart
- `DISCOUNT_CODE_UPDATED`: When a discount code that a customer applies to a cart is updated

The event name constants are available in `ClientAnalytics.eventNames`.

## Subscribe to an analytic event

You can subscribe to an analytic event to allow your Hydrogen app to listen for the event.
The following steps describe how to subscribe to the `PAGE_VIEW` analytic event.

1. Create a new client component in the `/components` directory of your Hydrogen app. For example, `components/AnalyticListener.client.jsx`.

2. In your client component, add the following code to subscribe to the analytic event:

   {% codeblock file, filename: 'components/AnalyticListener.client.jsx' %}

   ```js
   import {ClientAnalytics} from '@shopify/hydrogen/client';

   let init = false;
   export default function AnalyticsListener() {
     useEffect(() => {
       // Setup common page specific data
       ClientAnalytics.pushToPageAnalyticData({
         userLocale: navigator.language,
       });

       if (!init) {
         // One time initialization
         ClientAnalytics.subscribe(
           ClientAnalytics.eventNames.PAGE_VIEW,
           (payload) => {
             console.log(payload);
           }
         );
         init = true;
       }
     });

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

{% codeblock file, filename: 'components/Banner.client.jsx' %}

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

Collect analaytic data where you are making queries.

For example, making collection name and id available when receive `PAGE_VIEW`
analytic event:

{% codeblock file, filename: 'collections/[handle].server.js' %}

```js
const {data} = useShopQuery({
  query: QUERY,
  variables: {
    handle,
    country: country.isoCode,
    numProducts: collectionProductCount,
  },
  preload: true,
});

const collection = data.collection;

useServerAnalytics({
  canonicalPageUrl: `/collections/${handle}`,
  collectionName: collection.title,
  collectionId: collection.id,
});
```

{% endcodeblock %}

You can add to page analytic data from client components as well.

{% codeblock file, filename: '*.client.js' %}

```js
// some.client.jsx
useEffect(() => {
  ClientAnalytics.pushToPageAnalyticData({
    heroBanner: 'hero-1',
  });
});
```

{% endcodeblock %}

> Note: All `ClientAnalytics.*` function calls must be wrapped in a `useEffect`

To retrieve the data that's available elsewhere in your Hydrogen app, you can add the following code to your server and client components:

{% codeblock file, filename: '*.server.js' %}

```js
const serverDataLayer = useServerAnalytics();
```

> Note: Do not use the data from `useServerAnalytics()` for rendering. This will cause occasional hydration mismatch.

{% endcodeblock %}

You can get analytic data from client components too.

{% codeblock file, filename: '*.client.js' %}

```js
ClientAnalytics.getPageAnalyticData();
```

{% endcodeblock %}

> Note: Do not use the data from `ClientAnalytics.getPageAnalyticData()` for rendering. This will cause occasional hydration mismatch.

## Send analytic data from the server side

In order to send analytics from the server-side, do the following:

1. Create a client-side analytic listener that makes a fetch call to `__event` endpoint

{% codeblock file, filename: 'components/AnalyticListener.client.jsx' %}

```js
import {ClientAnalytics} from '@shopify/hydrogen/client';

let init = false;
export default function AnalyticsListener() {
  useEffect(() => {
    // Setup common page specific data
    ClientAnalytics.pushToPageAnalyticData({
      userLocale: navigator.language,
    });

    if (!init) {
      // One time initialization
      ClientAnalytics.subscribe(
        ClientAnalytics.eventNames.PAGE_VIEW,
        (payload) => {
          try {
            fetch('/__event', {
              method: 'post',
              headers: {
                'cache-control': 'no-cache',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            });
          } catch (e) {
            // deal with error
          }
        }
      );
      init = true;
    }
  });

  return null;
}
```

{% endcodeblock %}

2. Create a server-side analytic connector and pass it into the `serverAnalyticConnectors` config

{% codeblock file, filename: 'MyServerAnalyticConnector.jsx' %}

```js
export function request(request, data, contentType) {
  // Deal with your analytic request
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

### ServerAnalyticConnector request function paramters

| Parameter   | Type           | Description                            |
| ----------- | -------------- | -------------------------------------- |
| request     | Request        | The analytic request object            |
| data        | Object or Text | The result from `.json()` or `.text()` |
| contentType | string         | 'json' or 'text'                       |

## Unsubscribe from an analytic event

You can unsubscribe from analytic events that you no longer want your Hydrogen app to track. For example:

{% codeblock file, filename: 'components/SomeComponent.client.jsx' %}

```jsx
useEffect(() => {
  const pageViewSubscriber = ClientAnalytics.subscribe(
    'accepts-marketing',
    (payload) => {
      console.log(payload);
    }
  );

  return function cleanup() {
    pageViewSubscriber.unsubscribe();
  };
});
```

{% endcodeblock %}

## Next steps

- Learn about [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components), an opinionated data-fetching and rendering workflow for React apps.
- Learn how to customize the output of [SEO-related tags](/custom-storefronts/hydrogen/framework/seo) in your Hydrogen client and server components.
