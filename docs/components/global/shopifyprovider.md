---
gid: b4dc58a2-fafe-11eb-9a03-0242ac130003
title: ShopifyProvider
description: The ShopifyProvider component wraps your entire app and provides support for hooks.
---

The `ShopifyProvider` component wraps your entire app and provides functionality for many components, hooks, and utilities. The `ShopifyProvider` component also provides localization data for the app. You should place it in your app's entry point component.

{% if feature_flags.hydrogen_ui_beta%}
## `ShopifyProvider` in the Hydrogen framework

If you're using the [Hydrogen framework](/custom-storefronts/hydrogen/framework), then you need to import `ShopifyProvider` from the `@shopify/hydrogen` package and use it in `App.server.jsx`.
{% endif %}

The default localization data is defined within your [Hydrogen configuration file](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config). You can change the active country and language at runtime by passing in the `countryCode` and `languageCode` props.

### Example code

```tsx
import {ShopifyProvider} from '@shopify/hydrogen';

export default function App() {
  return <ShopifyProvider>{/* Routes, Pages, etc */}</ShopifyProvider>;
}
```

### Props

| Name           | Type                                                   | Description                                                                                                                                                                       |
| -------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| shopifyConfig? | <code>ShopifyConfig &#124; ShopifyConfigFetcher</code> | Shopify connection information. Defaults to [the `shopify` property in the `hydrogen.config.js` file](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config). |
| countryCode?   | <code>string</code>                                    | The [code](https://shopify.dev/api/storefront/latest/enums/CountryCode) designating a country or region, which generally follows ISO 3166-1 alpha-2 guidelines.                   |
| languageCode?  | <code>string</code>                                    | The ISO 639-1 [language codes](https://shopify.dev/api/storefront/latest/enums/LanguageCode) supported by Shopify.                                                                |
| children?      | <code>React</code>                                     | Any `ReactNode` elements.                                                                                                                                                         |

### Component type

The `ShopifyProvider` component is a server component that renders inside `App.server.jsx`. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components).

### Considerations

{% if feature_flags.hydrogen_ui_beta %}
- This version of `ShopifyProvider` is specific to Hydrogen and currently doesn't work in Next.js or other frameworks. Learn how to use `ShopifyProvider` [with other frameworks](#shopify-provider-in-alternate-frameworks).
{% endif %}
- You can't have multiple instances of `ShopifyProvider` within your app. Because it's not using `Context` (which isn't currently supported in server components), all `<ShopifyProvider>` instances share the same configuration for each request.
- You can dynamically define the Shopify connection information for each request to the server by providing a function in [the Hydrogen configuration file](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config#shopify). This is useful for aggregating multiple storefronts with a single Hydrogen app.

{% if feature_flags.hydrogen_ui_beta %}
## `ShopifyProvider` in alternate frameworks

If you're using a third-party framework, such as Next.js, you should import `ShopifyProvider` from Hydrogen UI via the `@shopify/hydrogen-react` package.

> Note:
> Hydrogen UI is an experiemental feature at this time and is subject to change. Learn more about using [alternate frameworks](/custom-storefronts/hydrogen/alternate-frameworks).

### Example code

```tsx
import {ShopifyProvider} from '@shopify/hydrogen-react';

export default function App() {
  return <ShopifyProvider>{/* Routes, Pages, etc */}</ShopifyProvider>;
}
```

### Props

| Name | Type | Description |
|---|---|---|
| storefrontId? | <code>string</code> | The globally-unique identifier for the Shop |
| storeDomain | <code>string</code> | The host name of the domain (eg: `{shop}.myshopify.com`). If a URL with a scheme (for example `https://`) is passed in, then the scheme is removed. |
| storefrontToken | <code>string</code> | The Storefront API public access token. Refer to the [authentication](https://shopify.dev/api/storefront#authentication) documentation for more details. |
| storefrontApiVersion | <code>string</code> | The Storefront API version. This should almost always be the same as the version Hydrogen-UI was built for. Learn more about Shopify [API versioning](https://shopify.dev/api/usage/versioning) for more details. |
| country? | <code>{isoCode: CountryCode}</code>  | The code designating a country, which generally follows ISO 3166-1 alpha-2 guidelines. If a territory doesn't have a country code value in the `CountryCode` enum, it might be considered a subdivision of another country. For example, the territories associated with Spain are represented by the country code `ES`, and the territories associated with the United States of America are represented by the country code `US`. |
| language? | <code>{isoCode: LanguageCode}</code> | `ISO 369` language codes supported by Shopify.
| locale? | <code>string</code> | The locale string based on `country` and `language`. | Any `ReactNode` elements.

### Considerations
- This version of `ShopifyProvider` is meant to only be used on the client. To make API calls from the server, check out the [`createShopifyClient()` helper](https://github.com/Shopify/hydrogen-ui/tree/2022-7/packages/react#authenticating-the-storefront-client).

{% endif %}
## Related framework topics

- [Hydrogen configuration](https://shopify.dev/custom-storefronts/hydrogen/framework/hydrogen-config)
- [Internationalization](https://shopify.dev/custom-storefronts/hydrogen/framework/internationalization)
