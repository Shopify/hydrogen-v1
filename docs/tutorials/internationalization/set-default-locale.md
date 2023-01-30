---
gid: 2dec76ee-ec76-487f-95d1-7d5eba5e7998
title: Set the default locale
description: Learn how to set your Hydrogen storefront's default language and country and how to retrieve translated content from the Storefront API.
---

[Internationalization] helps merchants expand their business to a global audience by creating shopping experiences in local languages and currencies. This guide provides information on configuring your storefront's [default language and country](/custom-storefronts/hydrogen/internationalization#default-locale) and how to retrieve translated content from the Storefront API.

## Set a default language and country

Set Hydrogen storefront's [default language and country](/custom-storefronts/hydrogen/internationalization) by setting the `defaultLanguageCode` and `defaultCountryCode` properties in the [Hydrogen configuration file](/custom-storefronts/hydrogen/configuration).

## Override the default locale at runtime

You can change the active country and language at runtime by passing overrides from the `countryCode` and `languageCode` props to the `ShopifyProvider` component.

## Retrieve translated content from the Storefront API

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

For more information about retrieving language translations and the `@inContext` directive, refer to the [Storefront API documentation](/custom-storefronts/internationalization/multiple-languages).

## Next steps

- Learn how to [internationalize routes](/custom-storefronts/hydrogen/internationalization/internationalize-routes).
- Learn how to configure other localized experiences for merchants and customers using the [GraphQL Storefront API](/api/storefront).
