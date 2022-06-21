---
gid: 16335d29-3334-49d5-bdcc-d9ec832fbffd
title: Internationalization
description: Learn how configure support in your Hydrogen storefront for international merchants and customers.
---

Internationalization helps merchants expand their business to a global audience by creating shopping experiences in local languages and currencies. This guide provides information on configuring localized experiences for merchants and customers in your Hydrogen storefront.

## Default configuration

You can configure your Hydrogen storefront's default locale and language by setting the `defaultLocale` property in the [Hydrogen configuration file](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config):

`defaultLocale`: Corresponds to a valid locale identifier used to make the request, using the [IETF language tag nomenclature](https://en.wikipedia.org/wiki/IETF_language_tag). The first letter code represents the language, and the second letter code represents the region. 

In the following example, the default locale of the Hydrogen storefront is set to `EN-US`.

{% codeblock file, filename: 'hydrogen.config.js' %}
```tsx
export default defineConfig({
  shopify: {
    /* The app's locale */
    defaultLocale: 'EN-US',
  },
});
```
{% endcodeblock %}


## Detecting a visitor's geolocation

The geographic location of your visitors helps you localize the experience to their preferred country and language. 

### Oxygen deployments

If you're hosting your Hydrogen storefront on Oxygen, then you can access a visitor’s geolocation by using the `request` object and retrieving it using `request.headers.get()`:

{% codeblock file, filename: 'index.server.jsx' %}

```tsx
export default function Homepage({request}) {
  return (
    <div>Thanks for visiting from {request.headers.get(‘oxygen-buyer-country’)}!</div>
  )
}
```

{% endcodeblock %}

The following geolocation variables are available from Oxygen:

- `'oxygen-buyer-ip'`
- `'oxygen-buyer-latitude'`
- `'oxygen-buyer-longitude'`
- `'oxygen-buyer-continent'`
- `'oxygen-buyer-country'`
- `'oxygen-buyer-region'`
- `'oxygen-buyer-region-code'`
- `'oxygen-buyer-city'`


### Non-Oxygen deployments

If you're hosting your Hydrogen storefront on a platform that isn't Oxygen, then you can access the [Accept-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language) HTTP header as a hint to the visitor's country and language preference: 

{% codeblock file, filename: 'index.server.jsx' %}

```tsx
export default function Homepage({request}) {
  const acceptLanguage = request.headers.get(‘accept-language’);
}
```

{% endcodeblock %}

> Note: 
> You can also consider using a third-party geolocation library, such as [`geoip-lite`](https://www.npmjs.com/package/geoip-lite).

## Internationalized routing

After you've detected a visitor's geolocation, you can assign custom routes to host and render a localized experience. Hydrogen supports two strategies for internationalized routes: domains and subfolders.


### Examples

- **Domain routes**: `yourshop.com`, `yourshop.ca`, `yourshop.co.uk`
- **Subdomain routes**: `us.yourshop.com`, `ca.yourshop.com`, `uk.yourshop.com`
- **Subfolder routes**: `yourshop.com/en/products`, `yourshop.com/en-CA/products`, `yourshop.com/fr/produits`

### Domains and subdomains

After you've set up your domains and subdomains in Oxygen, or third-party hosting provider, you can assign the domains to a given locale:

{% codeblock file, filename: 'App.server.jsx' %}

```tsx
function App({routes}) {
  
  
  return (. . .)
}
```

{% endcodeblock %}


### Subfolders

Subfolder routes use the visitor's locale in the URL path. In Hydrogen, you can use the [`FileRoutes`](https://shopify.dev/api/hydrogen/components/framework/fileroutes) component to prefix all file routes with a locale using the `basePath` parameter, and source the corresponding file routes:

{% codeblock file, filename: 'App.server.jsx' %}

import {Router, FileRoutes, Route} from '@shopify/hydrogen';
function App() {
  const esRoutes = import.meta.globEager('./custom-routes/es/**/*.server.jsx');
  const enRoutes = import.meta.globEager('./custom-routes/en/**/*.server.jsx');

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ShopifyProvider>
        <CartProvider>
          <Router>
            <FileRoutes />
            <FileRoutes basePath="/es/" routes={esRoutes} />
            <FileRoutes basePath="/en/" routes={enRoutes} />
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

{% endcodeblock %}


## Localization

Shopify helps merchants, all over the world, sell to customers, all over the world. This means that there are multiple currencies and languages that they might need to sell in.

### Localization components and hooks

Hydrogen includes the following localization components and hooks:

- **[`LocalizationProvider`](https://shopify.dev/api/hydrogen/components/localization/localizationprovider)**: A component that provides localization data in a context that can be used both within server and client components by the [`useLocalization`](https://shopify.dev/api/hydrogen/hooks/localization/uselocalization) hook.

- **[`useLocalization`](https://shopify.dev/api/hydrogen/hooks/localization/uselocalization)**: A hook that returns the locale, country, and language of the current page.

> Note:
> Any descendents of `LocalizationProvider` can use the `useLocalization` hook. The `isoCode` of the `country` can be used in the Storefront API's [`@inContext` directive](https://shopify.dev/api/examples/international-pricing) as the `country` value.

### Language translations

You can use the Storefront API's `@inContext` directive to support multiple languages on a storefront. For example, you might need to retrieve a list of available languages, query translatable resources and return translated content, or create a checkout in a customer's language.

For more information about retrieving language translations, refer to [Support multiple languages on storefronts](https://shopify.dev/api/examples/multiple-languages).

### Search engine optimization (SEO)

Hydrogen provides an [`Seo`](https://shopify.dev/api/hydrogen/components/primitive/seo) component that renders SEO information on a webpage. The language of the default page (`defaultSeo`) defaults to the `defaultLocale` value provided in your Hydrogen configuration file or `EN-US` when not specified.

For more information about customizing the output of SEO-related tags in your Hydrogen app, refer to [SEO](https://shopify.dev/custom-storefronts/hydrogen/framework/seo).

### `useServerProps` hook

Hydrogen provides a [`useServerProps`](https://shopify.dev/api/hydrogen/hooks/global/useserverprops) hook with a `setServerProps` helper function, which allows you to re-render the server component with new `props`. This is useful to paginate within collections, switch product variants, or do anything that requires new data from the server.

For example, you can take geolocation co-ordinates and set them as server props to provide a new hydrated experience for the current location:

{% codeblock file, filename: 'GeoLocate.client.jsx' %}

```js
navigator.geolocation.getCurrentPosition((data) => {
  setServerProps('geoCoordinates', data);
});
```

{% endcodeblock %}

## Next steps

- Learn about [Hydrogen's configuration properties](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config) and how to change the location of the configuration file.
- Consult the references for the [`LocalizationProvider`](https://shopify.dev/api/hydrogen/components/localization/localizationprovider) component and [`useLocalization`](https://shopify.dev/api/hydrogen/hooks/localization/uselocalization) hook.
- Learn how to customize the output of [SEO-related tags](https://shopify.dev/custom-storefronts/hydrogen/framework/seo) in your Hydrogen client and server components.
