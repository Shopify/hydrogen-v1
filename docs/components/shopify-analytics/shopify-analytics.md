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

In the `App.server.jsx`, include `ShopifyAnalytics`.

```jsx
function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ShopifyProvider>
        ...
        <ShopifyAnalytics />
      </ShopifyProvider>
    </Suspense>
  );
}
```

If you have a custom domain, you can set the cookie domain of the Shopify analytics
component.

```jsx
<ShopifyAnalytics cookieDomain="my-shop.com" />
```

Otherwise, this component will use the `storeDomain` value in the `hydrogen.config.js`
as the default cookie domain.

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

### (optional) `resourceId`

Identify the resource id for your routes that uses Shopify resources.
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

## `ShopifyAnalyticsConstants`

A list of `pageType` constants for Shopify analytics

| Page type | Description |
| ---- | ----------- |
| article | An article page |
| blog | A blog page |
| captcha | A captcha page |
| cart | A cart page |
| collection | A collection page |
| customersAccount | The customer account page |
| customersActivateAccount | The activate customer account page |
| customersAddresses | The customer address page |
| customersLogin | The customer login page |
| customersOrder | The customer order page |
| customersRegister | The customer register account page |
| customersResetPassword | The customer reset password page |
| giftCard | A gift card page |
| home | The home page |
| listCollections | A collections list page (ex. `/collections` on Online Store) |
| forbidden | A forbidden page |
| notFound | The not found page |
| page | A custom content page |
| password | The password page |
| product | A product page |
| policy | The policy page |
| search | A search page |

## Hydrogen analytics connect with checkout analytics

There is a strict requirement for the analytic cookies to be set at the 1st party
domain. This means that when a buyer navigates from your Hydrogen storefront to
Shopify checkout, the domain name must stay the same.

You can acheive this by assigning a subdomain to your online store. For example:

* Set your Hydrogen store domain at `https://www.my-awesome-hydrogen-store.com`
* Attach a new subdomain to your online store at `https://checkout.my-awesome-hydrogen-store.com`
* Set the cookieDomain to the same root domain `<ShopifyAnalytics cookieDomain="my-awesome-hydrogen-store.com" />`

> Note: It is expected behaviour that Hydrogen analytics and checkout analytics do not connect
when in development and preview mode. This will only connect in production mode.