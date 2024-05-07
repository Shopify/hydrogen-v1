# Configure analytics


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



Hydrogen includes [support for analytics](/tutorials/analytics/) that give you insight into how customers are interacting with a custom storefront.

This guide describes how to subscribe to the default events that Hydrogen offers, configure custom events, send analytics data from the server-side, and unsubscribe from events. It also provides example implementations of client analytics connectors, and shows how to write an end-to-end (E2E) for testing analytics connectors.

## Subscribe to events

Subscribe to an event to enable your Hydrogen app to listen for the event. The following steps describe how to subscribe to the `PAGE_VIEW` event.

1. Create a new client component in the `/components` directory of your Hydrogen app. For example, `components/AnalyticsListener.client.jsx`.

1. In your client component, add the following code to initialize the subscription to the `PAGE_VIEW` event:

    ```jsx
    // components/AnalyticsListener.client.jsx

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



1. Add your client component to your app's top-level React component (`App.server.jsx`):


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



1. Test the event by refreshing the root page of your app. The `PAGE_VIEW` payload object details display in the browser’s console log.

## Unsubscribe from events

You can unsubscribe from events that you no longer want your Hydrogen app to track. The following example shows how to unsubscribe from the `accepts-marketing` event:

```jsx
// components/SomeComponent.client.jsx

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



## Configure custom events

Aside from the [default events](/tutorials/analytics/index.md#default-events) that Hydrogen supports, you can also configure custom events. For example, you might want to configure a custom event that tracks the pages where a promotional banner is being clicked the most.

1. Emit a custom event by using the publish method and specifying a custom event name:

    ```jsx
    // components/Banner.client.jsx

    <Banner onClick={(event) => {
      ClientAnalytics.publish('select_promotion', true, {
        creative_name: "Summer Banner",
        creative_slot: "featured_app_1",
        ...
      })
    }}
    ```



1. In `AnalyticsListener`, use the `ClientAnalytics` component to subscribe to your custom event by name:

    ```jsx
    // components/AnalyticsListener.client.jsx

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



> Note:
> You can test the custom event subscription by clicking the button with the analytics event attached. The custom fields `creative_name` and `creative_slot` are added to the payload.

### Retrieve data from other parts of your Hydrogen storefront

You can capture analytics data wherever you make queries. The following are some examples:

#### Capture customer interaction data

You can capture data on how customers are interacting with your storefront.

The following example captures the Shopify product collection that a customer has interacted with. `collectionName` and `collectionId` fields are added to the `PAGE_VIEW` event object:

```js
// collections/[handle].server.js

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



When the collection page is reloaded, a `PAGE_VIEW` event displays in the console that includes the new `collectionName` and `collectionId` fields.

#### Capture events in client components

You can also capture events in client components, like when a customer makes a query that adds an item to their cart.

The following example captures when a customer clicks a promotional banner:

```js
// *.client.js

// some.client.jsx
useEffect(() => {
  ClientAnalytics.pushToPageAnalyticsData({
    heroBanner: 'hero-1',
  });
});
```



> Note:
> All `ClientAnalytics.*` function calls must be wrapped in a [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect) hook.

#### Retrieve analytics from client components

The following example shows how to retrieve page analytics data from a client component:

```js
// *.client.js

ClientAnalytics.getPageAnalyticsData();
```



> Caution:
> Don't use the data from `ClientAnalytics.getPageAnalyticsData()` for rendering. This will cause occasional mismatches during hydration.

#### Retrieve data that's available elsewhere

To retrieve the data that's available elsewhere in your Hydrogen storefront, you can add the following code to your server components:

```js
// *.server.js

const serverDataLayer = useServerAnalytics();
```

> Caution:
> Don't use the data from `useServerAnalytics()` for rendering. This causes occasional mismatches during hydration.



#### Trigger analytics events on navigation

If you need to trigger additional analytics events on navigation, then you can specify a list of analytics events to publish in your server component.

The following example publishes when a customer views a product:

```js
// *.server.js

const serverDataLayer = useServerAnalytics({
  publishEventsOnNavigate: [ClientAnalytics.eventNames.VIEWED_PRODUCT],
});
```



## Send analytics data from the server-side

To send analytics data from the server-side, complete the following steps:

1. Create a client-side analytics listener that makes a fetch call to the `__event` endpoint.

    ```jsx
    // components/AnalyticsListener.client.jsx

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



1. Create a server-side analytics connector:

    ```jsx
    // MyServerAnalyticsConnector.jsx

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



1. Pass the analytics connector into the `serverAnalyticsConnectors` configuration:

    ```js
    // hydrogen.config.ts

    import * as MyServerAnalyticsConnector from '/components/MyServerAnalyticsConnector.jsx'

    export default defineConfig({
      ...
      serverAnalyticsConnectors: [MyServerAnalyticsConnector]
    });
    ```



    > Tip:
    > Refer to the [request function parameters](/tutorials/analytics/index.md#parameters) for `ServerAnalyticsConnector`.

## Performance metrics

Hydrogen's [performance metrics](/tutorials/analytics/) provide insight into how fast pages are loading in your Hydrogen storefront.

### Opt-in to page load performance metrics

Include `<PerformanceMetrics />` in `App.server.js`.

### Log performance debug metrics

To see performance debug metrics displayed in your browser console log, then include `<PerformanceMetricsDebug />` in `App.server.js`:

```jsx
// App.server.jsx

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



## Implement a client analytics connector

The following example shows an implementation of a client analytics connector with [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4):

```jsx
// components/GoogleAnalytics.client.jsx

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

      function trackPageView(payload) {
        gtag('event', 'page_view');
      }

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
        trackPageView
      );

      ClientAnalytics.hasSentFirstPageView() &&
        trackPageView(ClientAnalytics.getPageAnalyticsData());
    }
  });

  return null;
}
```



> Note:
> The code calls `loadScript` instead of [`useLoadScript`](/hooks/primitive/useloadscript/). `useLoadScript` is a hook and can't be called inside `useEffect`.

The following example shows an implementation of a client analytics connector using the [getanalytics.io Google Tag Manager package](https://getanalytics.io/plugins/google-tag-manager/):

```jsx
// components/GoogleTagManager.client.jsx

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



## Test analytics connectors end-to-end

> Note:
> This test also works for [Google Tag Manager](https://getanalytics.io/plugins/google-tag-manager/) if you've configured it with Google Analytics 4.

The following example shows how to write an end-to-end (E2E) test for [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4).

```jsx
// tests/e2e/analytics.ga4.test.js

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


