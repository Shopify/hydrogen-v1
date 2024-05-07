# Data sources


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



Hydrogen contains a set of [Shopify-specific commerce components, hooks, and utilities](https://shopify.dev/docs/api/hydrogen) that help accelerate your development process. This guide describes how Hydrogen consumes data from different sources.

## How it works

Hydrogen supports data coming from Shopify and third-parties:

![A diagram that shows how Hydrogen consumes data](https://shopify.dev/assets/custom-storefronts/hydrogen/hydrogen-data-sources.png)

## Shopify data source

Hydrogen is built and optimized to use data coming from Shopify's [Storefront API](https://shopify.dev/api/storefront). The shape of the data passed to components, hooks, and utilities corresponds and conforms to the structure based on the GraphQL types from the Storefront API.

You can pass data from the Storefront API directly into [components](/components/), [hooks](/hooks/), and [utilities](/utilities/).

For example, the [`ProductOptionsProvider`](/components/product-variant/productoptionsprovider/) component expects product data to have the following structure, which corresponds to the [`Product`](https://shopify.dev/api/storefront/reference/products/product/) object type returned from the Storefront API:

```json
{
  "id": "<string>",
  "handle": "<string>",
  "title": "<string>",
  "description": "<string>",
  "descriptionHtml": "<string>",
  ...
}
```

## Third-party data sources

Hydrogen can also support data from third-party sources. If you want to use Hydrogen components with a third-party data source, then data from the third-party source must first be transformed into the types expected by the Hydrogen components, hooks, and utilities, and then passed on to the components, hooks, and utilities. Learn more about [working with third-party data sources](/tutorials/data-sources/work-with-3p-data-sources/).

## Next steps

- Learn how to perform common tasks for [working with third-party data sources in Hydrogen](/tutorials/data-sources/work-with-3p-data-sources/).
- Get familiar with the [Shopify-specific commerce components, hooks, and utilities](https://shopify.dev/docs/api/hydrogen) included in Hydrogen.
- Learn about [Hydrogen's architecture and framework](https://shopify.dev/docs/custom-storefronts/hydrogen).
