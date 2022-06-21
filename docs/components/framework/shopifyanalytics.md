---
gid: 398e9916-c99c-4d92-af5c-6681dd5e37d5
title: ShopifyAnalytics
description: The ShopifyAnalytics component sends commerce-related analytics to Shopify.
---

The `ShopifyAnalytics` component sends commerce-related analytics to Shopify. By adding the `ShopifyAnalytics` component to your Hydrogen storefront, you can view key sales, orders, and online store visitor data from the [Analytics dashboard in your Shopify admin](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/overview-dashboard).

> Note:
> Currently, only Online Store page view and session-related analytic reports can be configured with the `ShopifyAnalytics` component. Additional analytics functionality will be available in the coming weeks.

## Configuration

Add the `ShopifyAnalytics` component in `App.server.jsx`.

{% codeblock file, filename: 'App.server.jsx' %}

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

{% endcodeblock %}

If you have a custom domain or you're using sub-domains, then you can set the cookie domain of
the `ShopifyAnalytics` component so that cookies persists for your root domain:

{% codeblock file, filename: 'App.server.jsx' %}

```jsx
<ShopifyAnalytics cookieDomain="my-shop.com" />
```

{% endcodeblock %}

If you're not using custom domains or sub-domains, then the `ShopifyAnalytics` component uses the `storeDomain` value in the Hydrogen configuration file as the default cookie domain or leaves it blank when the specified cookie domain doesn't match `window.location.hostname`.

### Connecting Hydrogen analytics with Shopify checkout

Analytic cookies must be set at the first-party domain. This means that when a buyer navigates from your Hydrogen storefront to Shopify checkout, the domain name must stay the same.

You can achieve this by assigning a sub-domain to your online store. For example, you can do the following tasks:

- Set your Hydrogen store domain to `https://www.my-awesome-hydrogen-store.com`.
- Attach a new sub-domain to your online store at `https://checkout.my-awesome-hydrogen-store.com`.
- Set the `cookieDomain` to the same root domain at `<ShopifyAnalytics cookieDomain="my-awesome-hydrogen-store.com" />`.

> Note:
> Hydrogen analytics and Shopify checkout can only be connected in production. They can't be connected in development and preview modes.

## Shopify Analytics data

Provide the following data to `useServerAnalytics` to view information from the Analytics dashboard in your Shopify admin:

| Prop     |  Description         | Example code       |
| -------- | ------------------- | ------------------- |
| pageType? | The page template type for your routes. For a list of valid values, refer to [ShopifyAnalytics constants](#shopifyanalytics-constants). | [collections/[handle].server.jsx](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/routes/collections/%5Bhandle%5D.server.jsx) |
| resourceId? | The ID of the page template type for the routes that use Shopify resources. <br></br>This only applies to the following routes: `article`, `blog`, `collection`, `page`, `product`. | [products/[handle].server.jsx](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/routes/products/%5Bhandle%5D.server.jsx) |

### `ShopifyAnalytics` constants

The following table provides a list of valid values for the `pageType` property:

| Value     |  Description         |
| -------- | --------------------- |
| `article` | A page that displays an article in an online store blog. |
| `blog` | A page that displays an online store blog. |
| `captcha` | A page that uses Google's [reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3) to help prevent spam through customer, contact, and blog comment forms. |
| `cart` | A page that displays the merchandise that a buyer intends to purchase, and the estimated cost associated with the cart.  |
| `collection` | A page that displays a grouping of products. |
| `customersAccount` | A page that provides details about a customer's account. |
| `customersActivateAccount` | A page that enables a customer to activate their account. |
| `customersAddresses` | A page that displays a customer's addresses. |
| `customersLogin` | A page that enables a customer to log in to a storefront. |
| `customersOrder` | A page that displays a customer's orders. |
| `customersRegister` | A page that enables a customer to create and register their account. |
| `customersResetPassword` | A page that enables a customer to reset the password associated with their account. |
| `giftCard` | A page that displays an issued gift card. |
| `home` | The homepage of the online store. |
| `listCollections` | A page that displays a list of collections, which each contain a grouping of products. |
| `forbidden` | A page that users can't access due to insufficient permissions. |
| `notFound` | A page no longer exists or is inaccessible. |
| `page` | A page that holds static HTML content. Each `page` object represents a custom page on the online store. |
| `password` | A page that's shown when [password protection is applied to the store](https://help.shopify.com/en/manual/online-store/themes/password-page). |
| `product` | A page that represents an individual item for sale in a store. |
| `policy` | A page that provides the storefront's policy. |
| `search` | A page that displays the results of a [storefront search](https://help.shopify.com/en/manual/online-store/storefront-search). |

## Component type

The `ShopifyAnalytics` component is a server component, which means that it renders on the server. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

## Related framework topics

- [Analytics](https://shopify.dev/custom-storefronts/hydrogen/framework/analytics)
- [Session management](https://shopify.dev/custom-storefronts/hydrogen/framework/sessions)
