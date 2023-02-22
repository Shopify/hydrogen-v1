# ShopifyProvider


The `ShopifyProvider` component wraps your entire app and provides functionality for many components, hooks, and utilities. The `ShopifyProvider` component also provides localization data for the app. You should place it in your app's entry point component.

## `ShopifyProvider` in the Hydrogen framework

If you're using the [Hydrogen framework](https://shopify.dev/custom-storefronts/hydrogen/), then you need to import `ShopifyProvider` from the `@shopify/hydrogen` package and use it in `App.server.jsx`.

The default localization data is defined within your [Hydrogen configuration file](https://shopify.dev/custom-storefronts/hydrogen/configuration). You can change the active country and language at runtime by passing in the `countryCode` and `languageCode` props.

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
| shopifyConfig? | `ShopifyConfig &#124; ShopifyConfigFetcher` | Shopify connection information. Defaults to [the `shopify` property in the `hydrogen.config.js` file](https://shopify.dev/custom-storefronts/hydrogen/configuration). |
| countryCode?   | `string`                                    | The [code](https://shopify.dev/api/storefront/latest/enums/CountryCode) designating a country or region, which generally follows ISO 3166-1 alpha-2 guidelines.                   |
| languageCode?  | `string`                                    | The ISO 639-1 [language codes](https://shopify.dev/api/storefront/latest/enums/LanguageCode) supported by Shopify.                                                                |
| children?      | `React`                                     | Any `ReactNode` elements.                                                                                                                                                         |

### Component type

The `ShopifyProvider` component is a server component that renders inside `App.server.jsx`. For more information about component types, refer to [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/react-server-components).

### Considerations

- This version of `ShopifyProvider` is specific to Hydrogen and currently doesn't work in Next.js or other frameworks. Learn how to use `ShopifyProvider` [with other frameworks](#shopifyprovider-in-alternate-frameworks).
- You can't have multiple instances of `ShopifyProvider` within your app. Because it's not using `Context` (which isn't currently supported in server components), all `<ShopifyProvider>` instances share the same configuration for each request.
- You can dynamically define the Shopify connection information for each request to the server by providing a function in [the Hydrogen configuration file](https://shopify.dev/custom-storefronts/hydrogen/configuration#configuration-properties). This is useful for aggregating multiple storefronts with a single Hydrogen app.

## `ShopifyProvider` in alternate frameworks

If you're using a third-party framework, such as Next.js, you should import `ShopifyProvider` from React Storefront Kit using the `@shopify/storefront-kit-react` package.

> Note:
> React Storefront Kit is an experimental feature at this time and is subject to change. Learn more about using [React Storefront Kit](https://shopify.dev/custom-storefronts/react-storefront-kit).

### Example code

```tsx
import {ShopifyProvider} from '@shopify/storefront-kit-react';

export default function App() {
  return <ShopifyProvider>{/* Routes, Pages, etc */}</ShopifyProvider>;
}
```

### Props

| Name | Type | Description |
|---|---|---|
| storefrontId? | `string` | The globally unique identifier for the Shop |
| storeDomain | `string` | The host name of the domain (eg: `{shop}.myshopify.com`). If a URL with a scheme (for example `https://`) is passed in, then the scheme is removed. |
| storefrontToken | `string` | The Storefront API public access token. Refer to the [authentication](https://shopify.dev/api/storefront#authentication) documentation for more details. |
| storefrontApiVersion | `string` | The Storefront API version. This should almost always be the same as the version React Storefront Kit was built for. Learn more about Shopify [API versioning](https://shopify.dev/api/usage/versioning) for more details. |
| country? | `{isoCode: CountryCode}`  | The code designating a country, which generally follows ISO 3166-1 alpha-2 guidelines. If a territory doesn't have a country code value in the `CountryCode` enum, it might be considered a subdivision of another country. For example, the territories associated with Spain are represented by the country code `ES`, and the territories associated with the United States of America are represented by the country code `US`. |
| language? | `{isoCode: LanguageCode}` | `ISO 369` language codes supported by Shopify.
| locale? | `string` | The locale string based on `country` and `language`. | Any `ReactNode` elements.

### Considerations

- This version of `ShopifyProvider` is meant to only be used on the client. To make API calls from the server, check out the [`createShopifyClient()` helper](https://shopify.dev/custom-storefronts/react-storefront-kit#step-2-authenticate-the-storefront-api-client).

## Related framework topics

- [Hydrogen configuration](https://shopify.dev/custom-storefronts/hydrogen/configuration)
- [Internationalization](https://shopify.dev/custom-storefronts/hydrogen/internationalization)
