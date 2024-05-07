# Analytics


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



Hydrogen includes support for analytics that give you insight into how customers are interacting with a custom storefront. This guide describes how the analytics support that's built in to Hydrogen works

## How it works

The following diagram describes how analytics data is processed on the server and client in Hydrogen:

![Shows a diagram that describes how analytics data is processed on the server and client in Hydrogen](https://shopify.dev/assets/custom-storefronts/hydrogen/hydrogen-analytics.png)

1. On the server, the `useServerAnalytics` hook collects data in a single render request.

1. On the client, the data is streamed as part of the `Suspense` component. This single render request waits for all queries to complete, outputs the collected data from the server-side, and triggers a `PAGE_VIEW` event.

1. Events can be published to external endpoints from the client or server-side:

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

Learn how to [subscribe and unsubscribe](/tutorials/analytics/configure-analytics/) to events, and learn how to [configure custom events](/tutorials/analytics/configure-analytics.md#configure-custom-events)

## Analytics sent from the server-side

Some information that isn't relevant to storefront customers, but might be helpful for the development team, is only available on the server. For example, server-side information includes detailed information about how many API calls a single page render makes, or how long each API call took.

### Parameters

The following table describes the request function parameters for `ServerAnalyticsConnector`:

| Parameter       | Type           | Description                                       |
| --------------- | -------------- | ------------------------------------------------- |
| `requestUrl`    | string         | The analytics request url.                        |
| `requestHeader` | Headers        | The analytics request headers object.             |
| `data`          | object or text | The result from `.json()` or `.text()`.           |
| `contentType`   | string         | The content type. Valid values: `json` or `text`. |

Learn how to [send analytics data](/tutorials/analytics/configure-analytics.md#send-analytics-data-from-the-server-side) from the server-side.

## Performance metrics

Performance metrics provide insight into how fast pages are loading in your Hydrogen storefront. For example, you might want to gather the following metrics for full and sub page loads:

- **Time to First Byte (TTFB)**: The time between a browser requesting a page and receiving the first byte of information from the server
- **First Contentful Paint (FCP)**: The time it takes for a browser to render content on a page
- **Largest Contentful Paint (LCP)**: The time it takes to render and interact with the largest content element on the page
- **Duration**: The total amount of time it takes for a page to finish streaming

Learn about [displaying performance metrics](/tutorials/analytics/configure-analytics.md#performance-metrics).

## Related components

- [`ShopifyAnalytics`](/components/framework/shopifyanalytics/)

## Next steps

- Learn how to perform common tasks for [configuring analytics](/tutorials/analytics/configure-analytics/).
- Learn how to [configure queries to preload](/tutorials/querying/preloaded-queries/) in your Hydrogen app.
- Learn how to customize the output of [SEO-related tags](/tutorials/seo/manage-seo/) in your Hydrogen client and server components.
- Learn about [Hydrogen's configuration properties](/tutorials/configuration/) and how to change the location of the configuration file.
