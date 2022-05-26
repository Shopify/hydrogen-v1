Optional analytics components that allows you to send ecommerce related analytics to
Shopify. Adding the Shopify analytics components will allow the Shopify - Analytics
admin dashboard to work.

## Set up

In the `hydrogen.config.js`, add `ShopifyAnalyticsServerConnector`

```jsx
import {
  ...
  ShopifyAnalyticsServerConnector,
} from '@shopify/hydrogen';
...
export default defineConfig({
  ...
  serverAnalyticsConnectors: [
    PerformanceMetricsServerAnalyticsConnector,
    ShopifyAnalyticsServerConnector,
  ],
});
```

In the `App.server.jsx`, include `ShopifyAnalytics`. `cookieName` must be
the same one you used for session storage.

```jsx
function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ShopifyProvider>
        ...
        <ShopifyAnalytics cookieName="__session" />
      </ShopifyProvider>
    </Suspense>
  );
}
```

## Shopify Analytics data

Developers would need to provide the following analytics data in order for the
Shopify Analytics to work:

### (required) `shopId` and `currency`

Add `shopId` and `currency` with `useServerAnalytics`.

```jsx
const {
  data: {
    shop: {
      id,
      paymentSettings: {currencyCode},
    },
  },
} = useShopQuery({
  query: QUERY,
  cache: CacheDays(),
  preload: '*',
});

useServerAnalytics({
  shopify: {
    shopId: id,
    currency: currencyCode,
  },
});

const QUERY = gql`
  query shopInfo {
    shop {
      id
      paymentSettings {
        currencyCode
      }
    }
  }
`;
```

Example: `DefaultSeo.server.jsx`

### (optional) `pageType`

Identify the page template type for your routes.

```jsx
useServerAnalytics({
  shopify: {
    pageType: ShopifyAnalyticsConstants.pageType.collection,
  },
});
```

Examples:
* `src/routes/collections/[handle].server.jsx`
* `src/routes/products/[handle].server.jsx`
* `src/routes/pages/[handle].server.jsx`
* `src/routes/index.server.jsx`
* `src/components/NotFound.server.jsx`

### (optional) `resourceType` and `resourceId`

Identify the page template type for your routes that uses Shopify resources.
Only applies to the following page routes:

* article
* blog
* collection
* page
* product

```jsx
useServerAnalytics(
  data?.collection
    ? {
        shopify: {
          resourceType: ShopifyAnalyticsConstants.resourceType.collection,
          resourceId: data.collection.id,
        },
      }
    : null,
);
```

Examples:
* `src/routes/collections/[handle].server.jsx`
* `src/routes/products/[handle].server.jsx`
* `src/routes/pages/[handle].server.jsx`