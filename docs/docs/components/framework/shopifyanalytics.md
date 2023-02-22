# ShopifyAnalytics


The `ShopifyAnalytics` component sends commerce-related analytics to Shopify. By adding the `ShopifyAnalytics` component to your Hydrogen storefront, you can view key sales, orders, and online store visitor data from the [Analytics dashboard in your Shopify admin](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/overview-dashboard).

## Configuration

Add the `ShopifyAnalytics` component in `App.server.jsx`:

```jsx title="App.server.jsx"
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



If you have a custom domain or you're using sub-domains, then you can set the cookie domain of
the `ShopifyAnalytics` component so that cookies persists for your root domain:

```jsx title="App.server.jsx"
<ShopifyAnalytics cookieDomain="my-shop.com" />
```



If you're not using custom domains or sub-domains, then the `ShopifyAnalytics` component uses the `storeDomain` value in the Hydrogen configuration file as the default cookie domain or leaves it blank when the specified cookie domain doesn't match `window.location.hostname`.

If you have customer login, then make sure that `customerAccessToken` is passed to the `<CartProvider>`:

```jsx title="App.server.jsx"
const {customerAccessToken} = useSession();

useServerAnalytics({
  shopify: {
    isLoggedIn: !!customerAccessToken,
  },
});

return (
  <Suspense fallback={<HeaderFallback isHome={isHome} />}>
    ...
      <CartProvider
        countryCode={countryCode}
        customerAccessToken={customerAccessToken}
      >
```



### Connecting Hydrogen analytics with Shopify checkout

Analytics cookies must be set at the first-party domain. This means that when a buyer navigates from your Hydrogen storefront to Shopify checkout, the domain name must stay the same.

You can achieve this by assigning a sub-domain to your online store. For example, you can do the following tasks:

- Set your Hydrogen store domain to `https://www.my-awesome-hydrogen-store.com`.
- Attach a new sub-domain to your online store at `https://checkout.my-awesome-hydrogen-store.com`.
- Set the `cookieDomain` to the same root domain at `<ShopifyAnalytics cookieDomain="my-awesome-hydrogen-store.com" />`.

> Note:
> Hydrogen analytics and Shopify checkout can only be connected in production. They can't be connected in development and preview modes.

## Shopify Analytics data

Provide the following data to `useServerAnalytics` to view information from the Analytics dashboard in your Shopify admin:

| Prop     |  Description        |
| -------- | ------------------- |
| canonicalPath? | The URL path without localization. If you have the URL scheme `/page`, `/en-CA/page`, `/en-GB/page` that represents the same localized pages, then you can tell Shopify how to aggregate these events by setting the canonical path to `/page`. |
| pageType? | The page template type for your routes. For a list of valid values, refer to [`ShopifyAnalytics` constants](#shopifyanalytics-constants). |
| resourceId? | The ID of the page template type for the routes that use Shopify resources. <br />This only applies to the following routes: `article`, `blog`, `collection`, `page`, `product`. |
| collectionHandle? | The collection page handle. |
| products? | An array of [products](#product). |
| searchTerm? | The search term. |
| customerId? | The customer ID. |

#### Product

| Prop     |  Description        | Example |
| -------- | ------------------- | ------- |
| product_gid | The globally unique Shopify product ID. | `gid://shopify/Product/6730943955000` |
| variant_gid | The globally unique Shopify product variant ID. | `gid://shopify/ProductVariant/41007290712120` |
| name | The product title. | `The H2 Snowboard` |
| variant | The variant title. | `154cm / Reactive Blue` |
| brand | The product vendor. | `Snowdevil` |
| price | The variant price. | `629.95` |
| category? | The product type. | `Snowboards` |
| sku? | The variant SKU. | `123` |

### Home page

```jsx title="src/routes/index.server.jsx"
export default function Homepage() {
  useServerAnalytics({
    shopify: {
      canonicalPath: '/',
      pageType: ShopifyAnalyticsConstants.pageType.home,
    },
  });
```



### Collection page

```jsx title="src/routes/collections/[handle].server.jsx"
export default function Collection() {
  const {handle} = useRouteParams();
  ...
  useServerAnalytics({
    shopify: {
      canonicalPath: `/collections/${handle}`,
      pageType: ShopifyAnalyticsConstants.pageType.collection,
      resourceId: collection.id,
      collectionHandle: handle,
    },
  });
```



### Product page

```jsx title="src/routes/products/[handle].server.jsx"
export default function Product() {
  const {handle} = useRouteParams();
  ...
  useServerAnalytics({
    shopify: {
      canonicalPath: `/products/${handle}`,
      pageType: ShopifyAnalyticsConstants.pageType.product,
      resourceId: id,
      products: [
        {
          product_gid: id,
          variant_gid: variantId,
          variant: variantTitle,
          name: title,
          brand: vendor,
          category: productType,
          price: priceV2.amount,
          sku,
        },
      ],
    },
  });
```



### Search page

```jsx title="src/routes/search.server.jsx"
export default function Search() {
  ...
  const {searchParams} = useUrl();
  const searchTerm = searchParams.get('q');
  ...
  useServerAnalytics({
    shopify: {
      canonicalPath: '/search',
      pageType: ShopifyAnalyticsConstants.pageType.search,
      searchTerm,
    },
  });
```



### Account index page

```jsx title="src/routes/account/index.server.jsx"
export default function Account({response}: HydrogenRouteProps) {
  ...
  if (!customer) return response.redirect('/account/login');

  // The logged-in analytics state
  useServerAnalytics({
    shopify: {
      customerId: customer.id,
    },
  });
```



### Cart Fragment

If you're overriding the `CartProvider`'s `cartFragment` prop, then ensure that your new cart fragment contains the following data shape:

```gql
merchandise {
  ... on ProductVariant {
    id
    priceV2 {
      ...MoneyFragment
    }
    title
    product {
      id
      handle
      title
      vendor
      productType
    }
    sku
  }
}
```

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
| `customersResetPassword` | A page that enables a customer to reset the password that's associated with their account. |
| `giftCard` | A page that displays an issued gift card. |
| `home` | The homepage of the online store. |
| `listCollections` | A page that displays a list of collections that each contain a grouping of products. |
| `forbidden` | A page that users can't access due to insufficient permissions. |
| `notFound` | A page that no longer exists or is inaccessible. |
| `page` | A page that holds static HTML content. Each `page` object represents a custom page on the online store. |
| `password` | A page that's shown when [password protection is applied to the store](https://help.shopify.com/en/manual/online-store/themes/password-page). |
| `product` | A page that represents an individual item for sale in a store. |
| `policy` | A page that provides the storefront's policy. |
| `search` | A page that displays the results of a [storefront search](https://help.shopify.com/en/manual/online-store/storefront-search). |

## Component type

The `ShopifyAnalytics` component is a server component, which means that it renders on the server. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

## Related framework topics

- [Analytics](https://shopify.dev/custom-storefronts/hydrogen/analytics)
- [Session management](https://shopify.dev/custom-storefronts/hydrogen/sessions)
