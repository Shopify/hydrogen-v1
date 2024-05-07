# SEO


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



This guide how SEO works in Hydrogen and the output of SEO-related tags in your Hydrogen client and server components.

## How SEO works in Hydrogen

Hydrogen includes an [`Seo`](/components/primitive/seo/) client component that renders SEO information on a webpage. It also provides the following example SEO-related files in the [Demo Store template](/tutorials/getting-started/templates/):

- [`Sitemap.xml.server.ts`](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/routes/sitemap.xml.server.ts): A file that generates all products, collections, and pages URLs using the Storefront API

- [`Robots.txt.server.ts`](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/routes/robots.txt.server.ts): A file that sets default rules for which URLs can be crawled by search engines

### `Seo` client component

The [`Seo`](/components/primitive/seo/) client component uses the data from Storefront API to generate the `<head>` tags that search engines look for. For example, [`Product.Seo`](https://shopify.dev/api/storefront/latest/objects/Product/) is used to generate the `<head>` tags for the products page.

Learn how to [customize `<head>` tags](/tutorials/seo/manage-seo.md#customize-seo-at-the-route-level) at the route level.

## SEO bot behavior

By default, all routes in Hydrogen are stream rendered. However, Hydrogen supports SEO by inspecting the `user-agent` for every request, disabling streaming, and buffering the response to fully render it on the server-side. This enables you to properly inject `head` tags when the page is being served to SEO crawlers and bots.

Learn how to [customize bot behavior](/tutorials/seo/manage-seo.md#seo-bots).

## Limitations and considerations

The following limitations and considerations apply to the [XML sitemap](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/routes/sitemap.xml.server.ts) that's included in the Demo Store template:

- The sitemap has a limit of 250 products, 250 collections, and 250 pages. You need to [paginate results](https://shopify.dev/docs/api/usage/pagination-graphql) if your store has more than 250 resources.

  > Tip:
  > If your store has more resources than the limit, and you haven't customized the URLs of the resources, then we recommend using the Online Store version of the sitemap at `https://{store-domain}/sitemap.xml`.

- When you add or remove pages, the sitemap is automatically updated within one day. Similarly, if you unpublish a product, then the product is removed automatically from the sitemap.

- The sitemap is cached for 24 hours.

- By default, the sitemap uses the [`onlineStoreUrl`](https://shopify.dev/api/storefront/latest/objects/Product) field from the Storefront API as the URL. It falls back to the Demo Store template URL structure, which is based on resource's handle.

## Related components

- [`Seo`](/components/primitive/seo/)

## Next steps

- Learn how to perform common tasks for [managing routes SEO in Hydrogen](/tutorials/seo/manage-seo/).
- Learn about the [analytics support](/tutorials/analytics/) built into Hydrogen.
