Hydrogen includes support for analytics that give you insight into how customers are interacting with a custom storefront.

This guide describes how to subscribe to the default events that Hydrogen offers, configure custom events, send analytic data from the server-side, and unsubscribe from events. It also provides example implementations of client analytics connectors, and shows how to write an end-to-end (E2E) for testing analytics connectors.

## Default events

By default, Hydrogen publishes the following events to subscribers (`ClientAnalytics.subscribe`):

| Event name              | When the event is published                                  |
| ----------------------- | ------------------------------------------------------------ |
| `PAGE_VIEW`             | A customer visits a storefront page                          |
| `ADD_TO_CART`           | A customer adds an item to their cart                        |
| `UPDATE_CART`           | A customer updates an item in their cart                     |
| `REMOVE_FROM_CART`      | A customer removes an item from their cart                   |
| `DISCOUNT_CODE_UPDATED` | A discount code that a customer applies to a cart is updated |

> Note:
> The event name constants are available in `ClientAnalytics.eventNames`.

## Subscribe to an event

Subscribe to an event to enable your Hydrogen app to listen for the event. The following steps describe how to subscribe to the `PAGE_VIEW` event.

1. Create a new client component in the `/components` directory of your Hydrogen app. For example, `components/AnalyticListener.client.jsx`.

2. In your client component, add the following code to subscribe to the event:

   {% codeblock file, filename: 'components/AnalyticListener.client.jsx' %}

   ```jsx
   import {ClientAnalytics} from '@shopify/hydrogen/client';

   let init = false;
   export default function AnalyticsListener() {
     useEffect(() => {
       // Set up common page-specific data
       ClientAnalytics.pushToPageAnalyticData({
         userLocale: navigator.language,
       });

       if (!init) {
         // One-time initialization
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

3. Add your client component to `App.server.jsx`, which is the main app component:

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

## Configure a custom event

Aside from the [default events](#default-events) that Hydrogen supports, you can also configure custom events. For example, you might want to configure a custom event that tracks the pages where a promotional banner is being clicked the most:

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

### Retrieving data from other parts of your Hydrogen app

You can collect analytic data wherever you make queries. For example, to gather information about the collection that a customer has interacted with, you can make `collectionName` and `collectionId` available when you receive the `PAGE_VIEW` event:

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

You can also capture events in client components. For example, when a customer makes a query, such as adding an item to their cart, or clicking on a promotional banner, you can capture the event in your client component:

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

> Note:
> All `ClientAnalytics.*` function calls must be wrapped in a [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect) hook.

To retrieve the data that's available elsewhere in your Hydrogen app, you can add the following code to your server components:

{% codeblock file, filename: '*.server.js' %}

```js
const serverDataLayer = useServerAnalytics();
```

> Caution:
> Don't use the data from `useServerAnalytics()` for rendering. This will cause occasional mismatches during hydration.

{% endcodeblock %}

The following example shows how to retrieve analytic data from a client component:

{% codeblock file, filename: '*.client.js' %}

```js
ClientAnalytics.getPageAnalyticData();
```

{% endcodeblock %}

> Caution:
> Don't use the data from `ClientAnalytics.getPageAnalyticData()` for rendering. This will cause occasional mismatches during hydration.

## Send analytic data from the server-side

Some events are only available on the server, which makes sending analytic data from the server-side a good option. Server-side analytics monitor activities on the server itself and only process server-side information. Every request on your server is recorded in the server logs. You can send Shopify analytic data from the server-side because you know exactly what data you need to send.

To send analytic data from the server-side, complete the following steps:

1. Create a client-side analytic listener that makes a fetch call to the `__event` endpoint.

   {% codeblock file, filename: 'components/AnalyticListener.client.jsx' %}

   ```jsx
   import {ClientAnalytics} from '@shopify/hydrogen/client';

   let init = false;
   export default function AnalyticsListener() {
     useEffect(() => {
       // Set up common page-specific data
       ClientAnalytics.pushToPageAnalyticData({
         userLocale: navigator.language,
       });

       if (!init) {
         // One-time initialization
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
               // Error handling
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

2. Create a server-side analytic connector and pass it into the `serverAnalyticConnectors` configuration:

   {% codeblock file, filename: 'MyServerAnalyticConnector.jsx' %}

   ```jsx
   export function request(request, data, contentType) {
     // Send your analytic request to third-party analytics
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

#### Parameters

The following table describes the request function parameters for `ServerAnalyticConnector`:

| Parameter     | Type           | Description                                       |
| ------------- | -------------- | ------------------------------------------------- |
| `request`     | request        | The analytic request object.                      |
| `data`        | object or text | The result from `.json()` or `.text()`.           |
| `contentType` | string         | The content type. Valid values: `json` or `text`. |

## Unsubscribe from an event

You can unsubscribe from events that you no longer want your Hydrogen app to track. The following example shows how to unsubscribe from the `PAGE_VIEW` event:

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

## Example analytics connectors

The following example shows an implementation of a client analytics connector with [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4):

{% codeblock file, filename: 'components/GoogleAnalytics.client.jsx' %}

```jsx
import {useEffect} from 'react';
import {ClientAnalytics, loadScript} from '@shopify/hydrogen/client';

const GTAG_ID = '<YOUR_GTAG_ID>';
const URL = `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`;
let isInit = false;

export function GoogleAnalytics() {
  useEffect(() => {
    if (!isInit) {
      isInit = true;

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
      Analytics({
        app: 'hydrogen-app',
        plugins: [
          googleTagManager({
            containerId: '<YOUR_GTM_ID>',
          }),
        ],
      });
      init = true;
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
    // Wait for the Google Analytics 4 analytic network call
    const [request] = await Promise.all([
      // Test if the request matches a Google Analytics 4 analytic pixel
      session.page.waitForRequest((request) =>
        endpointRegex.test(request.url())
      ),
      // Navigate to the home page
      session.visit('/'),
    ]);

    // Validate data on the Google Analytics 4 analytic pixel
    const ga4Event = new URL(request.url());
    expect(ga4Event.searchParams.en).toEqual('page_view');
  }, 60000);
});
```

{% endcodeblock %}

## Next steps

- Learn about [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components), an opinionated data-fetching and rendering workflow for React apps.
- Learn how to customize the output of [SEO-related tags](/custom-storefronts/hydrogen/framework/seo) in your Hydrogen client and server components.
