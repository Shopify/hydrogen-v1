---
gid: 044c475e-f28g-444b-a984-26e7ebb8bec4
title: Analytics
description: Learn about the analytics support built into Hydrogen.
---

Hydrogen includes support for analytics that give you insight into how customers are interacting with a custom storefront.

This guide describes how to subscribe to the default events that Hydrogen offers, configure custom events, send analytics data from the server-side, and unsubscribe from events. It also provides example implementations of client analytics connectors, and shows how to write an end-to-end (E2E) for testing analytics connectors.

## How it works

The following diagram describes how analytics data is processed on the server and client in Hydrogen:

![Shows a diagram that describes how analytics data is processed on the server and client in Hydrogen](/assets/custom-storefronts/hydrogen/hydrogen-analytics.png)

1. On the server, the `useServerAnalytics` hook collects data in a single render request.

2. On the client, the data is streamed as part of the `Suspense` component. This single render request waits for all queries to complete, outputs the collected data from the server-side, and triggers a `PAGE_VIEW` event.

3. Events can be published to external endpoints from the client or server-side:

- **Client**: The client can subscribe to events and publish them to external endpoints.
- **Server**: Events are published to the `/__event` endpoint, a server analytics route. You can use server analytics connectors to publish the event to an external endpoint.

## Default events

By default, Hydrogen publishes the following events to subscribers (`ClientAnalytics.subscribe`):

| Event name              | When the event is published                                  |
| ----------------------- | ------------------------------------------------------------ |
| `PAGE_VIEW`             | A customer visits a storefront page                          |
| `ADD_TO_CART`           | A customer adds an item to their cart                        |
| `UPDATE_CART`           | A customer updates an item in their cart                     |
| `REMOVE_FROM_CART`      | A customer removes an item from their cart                   |
| `DISCOUNT_CODE_UPDATED` | A discount code that a customer applies to a cart is updated |
| `VIEWED_PRODUCT`        | A customer views a product details page. This is set with `publishEventsOnNavigate` on product pages.                      |
| `PERFORMANCE`           | The performance metrics for page loads in a Hydrogen storefront. This is available when you opt in to `<PerformanceMetrics />`.   |

> Note:
> The event name constants are available in `ClientAnalytics.eventNames`.

## Subscribe to an event

Subscribe to an event to enable your Hydrogen app to listen for the event. The following steps describe how to subscribe to the `PAGE_VIEW` event.

1. Create a new client component in the `/components` directory of your Hydrogen app. For example, `components/AnalyticsListener.client.jsx`.

2. In your client component, add the following code to initialize the subscription to the `PAGE_VIEW` event:

    {% codeblock file, filename: 'components/AnalyticsListener.client.jsx' %}

    ```jsx
    import {ClientAnalytics} from '@shopify/hydrogen';

    let init = false;
    export default function AnalyticsListener() {
     useEffect(() => {
       // Set up common page-specific data
       ClientAnalytics.pushToPageAnalyticsData({
         userLocale: navigator.language,
       });

       if (!init) {
         // One-time initialization
         init = true;
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

    {% endcodeblock %}

3. Add your client component to your app's top-level React component (`App.server.jsx`):

    {% codeblock file, filename: 'App.server.jsx' %}

    ```jsx
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


4.  Test the event by refreshing the root page of your app. The `PAGE_VIEW` payload object details display in the browser’s console log.


## Configure a custom event

Aside from the [default events](#default-events) that Hydrogen supports, you can also configure custom events. For example, you might want to configure a custom event that tracks the pages where a promotional banner is being clicked the most.


1. Emit a custom event by using the publish method and specifying a custom event name:

{% codeblock file, filename: 'components/Banner.client.jsx' %}

```jsx
<Banner onClick={(event) => {
  ClientAnalytics.publish('select_promotion', {
    creative_name: "Summer Banner",
    creative_slot: "featured_app_1",
    ...
  })
}}
```

{% endcodeblock %}

2. In `AnalyticsListener`, use the `ClientAnalytics` component to subscribe to your custom event by name:

{% codeblock file, filename: 'components/AnalyticsListener.client.jsx' %}
```jsx
 import {ClientAnalytics} from '@shopify/hydrogen';

 let init = false;
 export default function AnalyticsListener() {
   useEffect(() => {
     // Set up common page-specific data
     ClientAnalytics.pushToPageAnalyticsData({
       userLocale: navigator.language,
     });

     if (!init) {
       // One-time initialization
       init = true;
       ClientAnalytics.subscribe(
       'select_promotion',
         (payload) => {
           console.log('select_promotion payload', payload);
         }
       );
     }
   });

   return null;
 }
```
{% endcodeblock %}

> Note: 
> You can test the custom event subscription by clicking the button with the analytics event attached. The  custom fields `creative_name` and `creative_slot` are added to the payload.

### Retrieving data from other parts of your Hydrogen storefront

You can gather analytics data wherever you make queries. For example, to capture information about the Shopify product collection that a customer has interacted with, you can add the `collectionName` and `collectionId` fields to the `PAGE_VIEW` event object.

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

// Use the `useServerAnalytics` hook to supply data
// when events are published
useServerAnalytics({
  canonicalPageUrl: `/collections/${handle}`,
  collectionName: collection.title,
  collectionId: collection.id,
});
```

{% endcodeblock %}

When you reload  the collection page you, a `PAGE_VIEW` event displays in the console that includes the new `collectionName` and `collectionId` fields.


You can also capture events in client components. For example, when a customer makes a query, such as adding an item to their cart, or clicking on a promotional banner, you can capture the event in your client component:

{% codeblock file, filename: '*.client.js' %}

```js
// some.client.jsx
useEffect(() => {
  ClientAnalytics.pushToPageAnalyticsData({
    heroBanner: 'hero-1',
  });
});
```

{% endcodeblock %}

> Note:
> All `ClientAnalytics.*` function calls must be wrapped in a [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect) hook.

To retrieve the data that's available elsewhere in your Hydrogen storefront, you can add the following code to your server components:

{% codeblock file, filename: '*.server.js' %}

```js
const serverDataLayer = useServerAnalytics();
```

> Caution:
> Don't use the data from `useServerAnalytics()` for rendering. This will cause occasional mismatches during hydration.

{% endcodeblock %}

If you need to trigger additional analytics events on navigation, then you can specify a list of analytics events
to publish in your server component:

{% codeblock file, filename: '*.server.js' %}

```js
const serverDataLayer = useServerAnalytics({
  publishEventsOnNavigate: [ClientAnalytics.eventNames.VIEWED_PRODUCT],
});
```

{% endcodeblock %}

The following example shows how to retrieve analytics data from a client component:

{% codeblock file, filename: '*.client.js' %}

```js
ClientAnalytics.getPageAnalyticsData();
```

{% endcodeblock %}

> Caution:
> Don't use the data from `ClientAnalytics.getPageAnalyticsData()` for rendering. This will cause occasional mismatches during hydration.

## Send analytics data from the server-side

Some information that isn't relevant to storefront customers, but might be helpful for the development team, is only available on the server. For example, server-side information includes detailed information about how many API calls a single page render makes, or how long each API call took.

To send analytics data from the server-side, complete the following steps:

1. Create a client-side analytics listener that makes a fetch call to the `__event` endpoint.

    {% codeblock file, filename: 'components/AnalyticsListener.client.jsx' %}

    ```jsx
    import {ClientAnalytics} from '@shopify/hydrogen';

    let init = false;
    export default function AnalyticsListener() {
     useEffect(() => {
       // Set up common page-specific data
       ClientAnalytics.pushToPageAnalyticsData({
         userLocale: navigator.language,
       });

       if (!init) {
         // One-time initialization
         init = true;
         ClientAnalytics.subscribe(
           ClientAnalytics.eventNames.PAGE_VIEW,
           (payload) => {
             try {
               ClientAnalytics.pushToServer({
                 method: 'post',
                 headers: {
                   'cache-control': 'no-cache',
                   'Content-Type': 'application/json',
                 },
                 body: JSON.stringify(payload),
               });
             } catch (e) {
               // Error handling
             }
           }
         );
       }
     });

     return null;
    }
    ```

    {% endcodeblock %}

2. Create a server-side analytics connector and pass it into the `serverAnalyticsConnectors` configuration:

    {% codeblock file, filename: 'MyServerAnalyticsConnector.jsx' %}

    ```jsx
    export const MyServerAnalyticsConnector = {
      request(requestUrl, requestHeader, data, contentType) {
        // Send your analytics request to third-party analytics
        // Make sure to return a promise, for example
        //
        // return fetch('your_analytic_endpoint')
        return Promise.resolve();
      },
    };
    ```

    {% endcodeblock %}

    {% codeblock file, filename: 'hydrogen.config.js' %}

    ```js
    import * as MyServerAnalyticsConnector from '/components/MyServerAnalyticsConnector.jsx'

    export default defineConfig({
      ...
      serverAnalyticsConnectors: [MyServerAnalyticsConnector]
    });
    ```

    {% endcodeblock %}

### Parameters

The following table describes the request function parameters for `ServerAnalyticsConnector`:

| Parameter       | Type           | Description                                       |
| --------------- | -------------- | ------------------------------------------------- |
| `requestUrl`    | string         | The analytics request url.                        |
| `requestHeader` | Headers        | The analytics request headers object.             |
| `data`          | object or text | The result from `.json()` or `.text()`.           |
| `contentType`   | string         | The content type. Valid values: `json` or `text`. |

## Unsubscribe from an event

You can unsubscribe from events that you no longer want your Hydrogen app to track. The following example shows how to unsubscribe from the `accepts-marketing` event:

{% codeblock file, filename: 'components/SomeComponent.client.jsx' %}

```jsx
useEffect(() => {
  const acceptMarketingSubscriber = ClientAnalytics.subscribe(
    'accepts-marketing',
    (payload) => {
      console.log(payload);
    }
  );

  return function cleanup() {
    acceptMarketingSubscriber.unsubscribe();
  };
});
```

{% endcodeblock %}

## Performance metrics

Performance metrics provide insight into how fast pages are loading in your Hydrogen storefront. For example, you might want to gather the following metrics for full and sub page loads:

- **Time to First Byte (TTFB)**: The time between a browser requesting a page and receiving the first byte of information from the server
- **First Contentful Paint (FCP)**: The time it takes for a browser to render content on a page
- **Largest Contentful Paint (LCP)**: The time it takes to render and interact with the largest content element on the page
- **Duration**: The total amount of time it takes for a page to finish streaming

You can opt in to receive performance metrics for page loads in your Hydrogen storefront by including `<PerformanceMetrics />` in `App.server.js`.

If you want to see performance debug metrics displayed in your browser console log, then include `<PerformanceMetricsDebug />` in `App.server.js`:

{% codeblock file, filename: 'App.server.jsx' %}

```jsx
import {
  PerformanceMetrics,
  PerformanceMetricsDebug,
  ...
} from '@shopify/hydrogen';

function App({routes}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ShopifyProvider shopifyConfig={shopifyConfig}>
        ...
        <PerformanceMetrics />
        {import.meta.env.DEV && <PerformanceMetricsDebug />}
      </ShopifyProvider>
    </Suspense>
  );
}
```

{% endcodeblock %}

## Example analytics connectors

The following example shows an implementation of a client analytics connector with [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4):

{% codeblock file, filename: 'components/GoogleAnalytics.client.jsx' %}

```jsx
import {useEffect} from 'react';
import {ClientAnalytics, loadScript} from '@shopify/hydrogen';

const GTAG_ID = '<YOUR_GTAG_ID>';
const URL = `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`;
let init = false;

export function GoogleAnalytics() {
  useEffect(() => {
    if (!init) {
      init = true;

      // Load the gtag script
      loadScript(URL).catch(() => {});

      // gtag initialization code
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag('js', new Date());

      // Configure your gtag
      gtag('config', GTAG_ID, {
        send_page_view: false,
      });

      // Listen for events from Hydrogen
      ClientAnalytics.subscribe(
        ClientAnalytics.eventNames.PAGE_VIEW,
        (payload) => {
          gtag('event', 'page_view');
        }
      );
    }
  });

  return null;
}
```

{% endcodeblock %}

The following example shows an implementation of a client analytics connector using the [getanalytics.io Google Tag Manager package](https://getanalytics.io/plugins/google-tag-manager/):

{% codeblock file, filename: 'components/GoogleTagManager.client.jsx' %}

```jsx
import Analytics from 'analytics';
import googleTagManager from '@analytics/google-tag-manager';
import {useEffect} from 'react';

let init = false;
export default function GTM() {
  useEffect(() => {
    if (!init) {
      // One-time initialization
      init = true;
      Analytics({
        app: 'hydrogen-app',
        plugins: [
          googleTagManager({
            containerId: '<YOUR_GTM_ID>',
          }),
        ],
      });
    }
  });
  return null;
}
```

{% endcodeblock %}

### Testing analytics connectors

The following example shows how to write an end-to-end (E2E) test for Google Analytics 4. This test will also work for Google Tag Manager if you've configured it with Google Analytics 4:

{% codeblock file, filename: 'tests/e2e/analytics.ga4.test.js' %}

```jsx
import {startHydrogenServer} from '../utils';

const ANALYTICS_ENDPOINT = 'https://www.google-analytics.com/g/collect';
const endpointRegex = new RegExp(`^${ANALYTICS_ENDPOINT}`);

describe('Google Analytics 4', () => {
  let hydrogen;
  let session;

  beforeAll(async () => {
    hydrogen = await startHydrogenServer();
  });

  beforeEach(async () => {
    session = await hydrogen.newPage();
  });

  afterAll(async () => {
    await hydrogen.cleanUp();
  });

  it('should emit page_view', async () => {
    // Wait for the Google Analytics 4 network call
    const [request] = await Promise.all([
      // Test if the request matches a Google Analytics 4 analytics pixel
      session.page.waitForRequest((request) =>
        endpointRegex.test(request.url())
      ),
      // Navigate to the home page
      session.visit('/'),
    ]);

    // Validate data on the Google Analytics 4 analytics pixel
    const ga4Event = new URL(request.url());
    expect(ga4Event.searchParams.en).toEqual('page_view');
  }, 60000);
});
```

{% endcodeblock %}

## Related components

- [`ShopifyAnalytics`](https://shopify.dev/api/hydrogen/components/framework/shopifyanalytics)

## Next steps

- Learn how to [configure queries to preload](https://shopify.dev/custom-storefronts/hydrogen/framework/preloaded-queries) in your Hydrogen app.
- Learn how to customize the output of [SEO-related tags](https://shopify.dev/custom-storefronts/hydrogen/framework/seo) in your Hydrogen client and server components.
- Learn about [Hydrogen's configuration properties](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config) and how to change the location of the configuration file.
