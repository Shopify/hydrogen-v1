---
gid: 16335d29-3334-49d5-bdcc-d9ec832fbffd
title: Internationalization
description: Learn about Hydrogen support for selling to international merchants and customers.
---
{% if feature_flags.hydrogen2 %}
## Introduction

Provide a summary of the product including why a developer would want to build it. Be sure to include a summary of all the key use cases that are possible with the product.

## Requirements

Provide a list of any requirements that are needed to use the product.

### Example

- Create a Partner account and a development store.
- Understand how apps fit into Shopify and the different types of apps you can build.
- Install the latest version of Node.js.

## System architecture

Include a diagram of the overall process or system architecture that you want to explain. For accessibility reasons, you should always include numbered steps with your diagram.

### Examples

- [Post-purchase checkout extensions](/apps/checkout/post-purchase#customer-flow).
- [Apps getting started](/apps/getting-started#whats-a-shopify-app)

## Developer tools and resources

Include a full index of assets that the product offers. This could include a list of API objects, links to UX guidelines, or any other developer tools and resources such as liquid drops or SDKs.

<!-- Use resource cards to list the resources in higher level overviews whenever possible. Between 2-4 resource cards per section is ideal. -->

### Example

- [Shopify themes overview](/themes/getting-started#tools-best-practices-and-references)

## Limitations

Make sure to spell out any limitations or caveats and considerations. You can also optionally call this section "Limitations and considerations", or have a separate section called "Considerations".

- Limitation one
- Limitation two

### Examples

- [Post-purchase checkout extensions overview](/apps/checkout/post-purchase#limitations-and-considerations)

## Next steps

Include a link to the getting started or any other tutorials.

- Link: Brief description of what they will learn about at the link.

### Example

- [Upsell example](/apps/checkout/post-purchase/update-an-order-for-a-checkout-post-purchase-app-extension): How to create a post-purchase upsell using checkout extensions.
- [Guidelines for post-purchase upsell](/apps/checkout/post-purchase/ux-guidelines-post-purchase-offers): Guidelines to create post-purchase extensions for merchants and buyers

{% else %}

Internationalization helps merchants expand their business to a global audience by creating shopping experiences in local languages and currencies.

## How it works

{% include /internationalization/intro.md %}

Hydrogen includes the following components and hooks for localization:

- **[`ShopifyProvider`](/api/hydrogen/components/global/shopifyprovider)**: A component that provides localization data in a context that can be used both within server and client components by the [`useLocalization`](/api/hydrogen/hooks/localization/uselocalization) hook.

- **[`useLocalization`](/api/hydrogen/hooks/localization/uselocalization)**: A hook that returns the locale, country, and language of the current page.

> Note:
> Any descendants of `ShopifyProvider` can use the `useLocalization` hook. The `isoCode` of the `country` can be used in the Storefront API's [`@inContext` directive](/custom-storefronts/internationalization/international-pricing) as the `country` value.

## Default locale

`ShopifyProvider` uses the `defaultLanguageCode` and `defaultCountryCode` properties in the [Hydrogen configuration file](/custom-storefronts/hydrogen/configuration) to set your storefront's default locale.

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

You can override these default values, either in the [Hydrogen config file](/custom-storefronts/hydrogen/internationalization/set-default-locale#set-a-default-language-and-country) or [at runtime](/custom-storefronts/hydrogen/internationalization/set-default-locale#override-the-default-locale-at-runtime).

## Search engine optimization (SEO)

Hydrogen provides an [`Seo`](/api/hydrogen/components/primitive/seo) component that renders SEO information on a webpage. The language of the default page (`defaultSeo`) defaults to the locale within the [`ShopifyProvider`](/api/hydrogen/components/global/shopifyprovider) component.

For more information about customizing the output of SEO-related tags in your Hydrogen app, refer to [SEO](/custom-storefronts/hydrogen/seo).

## International routing

Hydrogen supports domains and subfolders for internationalized routes.

- **Top-level domain routes**: `yourshop.com`, `yourshop.ca`, `yourshop.co.uk`
- **Subdomain routes**: `us.yourshop.com`, `ca.yourshop.com`, `uk.yourshop.com`
- **Subfolder routes**: `yourshop.com/en/products`, `yourshop.com/en-CA/products`, `yourshop.com/fr/produits`

Learn how to [internationalize routes](/custom-storefronts/hydrogen/internationalization/internationalize-routes).

## Next steps

- Learn how you can internationalize your storefront by setting [locales](/custom-storefronts/hydrogen/internationalization/set-default-locale) and [routing](/custom-storefronts/hydrogen/internationalization/internationalize-routes).
- Learn how to configure localized experiences for merchants and customers using the [GraphQL Storefront API](/api/storefront).
- Learn about [Hydrogen's configuration properties](/custom-storefronts/hydrogen/configuration) and how to change the location of the configuration file.
- Consult the references for the [`ShopifyProvider`](/api/hydrogen/components/global/shopifyprovider) component and [`useLocalization`](/api/hydrogen/hooks/localization/uselocalization) hook.
- Learn how to customize the output of [SEO-related tags](/custom-storefronts/hydrogen/seo) in your Hydrogen client and server components.

{% endif %}
