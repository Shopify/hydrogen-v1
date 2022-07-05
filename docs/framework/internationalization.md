---
gid: 16335d29-3334-49d5-bdcc-d9ec832fbffd
title: Internationalization
description: Learn how configure support in your Hydrogen storefront for international merchants and customers.
---

Internationalization helps merchants expand their business to a global audience by creating shopping experiences in local languages and currencies. This guide provides information on configuring localized experiences for merchants and customers in your Hydrogen storefront.

## Localization

Shopify helps merchants all over the world, sell to customers all over the world. This means that there are multiple currencies and languages that they might need to sell in.

Hydrogen includes the following components and hooks for localization:

- **[`ShopifyProvider`](https://shopify.dev/api/hydrogen/components/global/shopifyprovider)**: A component that provides localization data in a context that can be used both within server and client components by the [`useLocalization`](https://shopify.dev/api/hydrogen/hooks/localization/uselocalization) hook.

- **[`useLocalization`](https://shopify.dev/api/hydrogen/hooks/localization/uselocalization)**: A hook that returns the locale, country, and language of the current page.

> Note:
> Any descendents of `ShopifyProvider` can use the `useLocalization` hook. The `isoCode` of the `country` can be used in the Storefront API's [`@inContext` directive](https://shopify.dev/api/examples/international-pricing) as the `country` value.

### Default configuration

You can configure your Hydrogen storefront's default language and country by setting the `defaultLanguageCode` and `defaultCountryCode` properties in the [Hydrogen configuration file](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config).

`ShopifyProvider` uses these default values, unless it's passed an override from the `languageCode` or `countryCode` props.

In the following example, the default language is set to English and the default country is set to the United States:

{% codeblock file, filename: 'hydrogen.config.js' %}
```tsx
export default defineConfig({
  shopify: {
    /* The app's locale */
    defaultLanguageCode: 'en',
    defaultCountryCode: 'US',
  },
});
```
{% endcodeblock %}

### Overriding the default locale

You can change the active country and language at runtime by passing the `countryCode` and `languageCode` props to the `ShopifyProvider` component.

### Retrieving translated content from the Storefront API

You can use the `useLocalization` hook to pass the visitor's active `country` and `language` into your Storefront API query. For example, you might need to create a product page in a customer's language:

{% codeblock file %}
```tsx

import { gql, useLocalization, useShopQuery } from '@shopify/hydrogen';

export function MyComponent() {

  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

   const {data} = useShopQuery({
    query,
    variables: {
      country: countryCode,
      language: languageCode,
    },
  });

  return (
    /* Your JSX * /
  )
}

const QUERY = gql`
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      ...
    }
  }
`
```
{% endcodeblock %}

For more information about retrieving language translations and the `@inContext` directive, refer to the [Storefront API documentation](https://shopify.dev/api/examples/multiple-languages).

### Search engine optimization (SEO)

Hydrogen provides an [`Seo`](https://shopify.dev/api/hydrogen/components/primitive/seo) component that renders SEO information on a webpage. The language of the default page (`defaultSeo`) defaults to the locale within the [`ShopifyProvider`](https://shopify.dev/api/hydrogen/components/global/shopifyprovider) component.

For more information about customizing the output of SEO-related tags in your Hydrogen app, refer to [SEO](https://shopify.dev/custom-storefronts/hydrogen/framework/seo).

## International routing

Hydrogen supports domains and subfolders for internationalized routes.

- **Top-level domain routes**: `yourshop.com`, `yourshop.ca`, `yourshop.co.uk`
- **Subdomain routes**: `us.yourshop.com`, `ca.yourshop.com`, `uk.yourshop.com`
- **Subfolder routes**: `yourshop.com/en/products`, `yourshop.com/en-CA/products`, `yourshop.com/fr/produits`

### Set up domains and subdomains

To set up domains and subdomains, complete the following steps:

1. [Add all of your domains and subdomains in Shopify](https://help.shopify.com/en/manual/domains/add-a-domain).

2. From your Shopify admin, under **Settings > Domains**, update your domains and subdomains to target your custom storefront. Your primary domain is used for the default URL when customers visit your store.

For non-primary domains and subdomains where you want to host a localized experience, set the domain type to **Routing**.

### Set up subfolders

Subfolder routes use the visitor's locale in the URL path. In Hydrogen, you can use the [`FileRoutes`](https://shopify.dev/api/hydrogen/components/framework/fileroutes) component to prefix all file routes with a locale using the `basePath` parameter, and to source the corresponding file routes:

{% codeblock file, filename: 'App.server.jsx' %}
```tsx
import {
  FileRoutes,
  Route,
  Router,
  ShopifyProvider,
} from '@shopify/hydrogen';

function App({routes, request}) {
  const pathname = new URL(request.normalizedUrl).pathname;
  const acceptLanguage = request.headers.get(‘accept-language’);
  const countryCode = acceptLanguage?.replace(/-.*/, '') || undefined; // Or set a default country code. For example, 'en'.

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ShopifyProvider countryCode={countryCode}>
        <CartProvider>
          <Router>
            <FileRoutes
              basePath={countryCode ? `/${countryCode}/` : null}
              routes={routes}
            />
            <Route path="*" page={<NotFound />} />
          </Router>
        </CartProvider>
      </ShopifyProvider>
    </Suspense>
  );
}
function NotFound() {
  return <h1>Not found</h1>;
}
```
{% endcodeblock %}

### Redirects

After you've set up your routing strategies, you can create redirects based on your visitor's locale. You can trigger redirects manually. For example, a visitor changes their country using a dropdown menu, or automatically, based on a visitor's geolocation.

Shopify recommends manual redirects for customer privacy and SEO best practices. For example, reference the [`CountrySelector.client`](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/components/CountrySelector.client.tsx) component in the Hydrogen demo store.

If you're hosting your Hydrogen storefront on Oxygen, then you can access a visitor’s geolocation by using the `request` object and retrieve it using `request.headers.get()`:

{% codeblock %}

```tsx
const userCountry = request.headers.get('oxygen-buyer-country');
```

{% endcodeblock %}

[View a full list](https://shopify.dev/custom-storefronts/oxygen/worker-runtime-apis#custom-headers) of custom HTTP headers available from Oxygen.

If you're hosting your Hydrogen storefront on a platform that isn't Oxygen, then you can access the [Accept-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language) HTTP header as a hint to the visitor's country and language preference:

{% codeblock %}

```tsx
const acceptLanguage = request.headers.get(‘accept-language’);
const countryCode = acceptLanguage?.replace(/-.*/, '') || undefined; // Or set a default country code. For example, 'en'.
```

{% endcodeblock %}

> Note:
> You can also consider using a third-party geolocation library, such as [`geoip-lite`](https://www.npmjs.com/package/geoip-lite).

## Next steps

- Learn about [Hydrogen's configuration properties](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config) and how to change the location of the configuration file.
- Consult the references for the [`ShopifyProvider` component](https://shopify.dev/api/hydrogen/components/global/shopifyprovider) component and [`useLocalization`](https://shopify.dev/api/hydrogen/hooks/localization/uselocalization) hook.
- Learn how to customize the output of [SEO-related tags](https://shopify.dev/custom-storefronts/hydrogen/framework/seo) in your Hydrogen client and server components.
