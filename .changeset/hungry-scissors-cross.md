---
'@shopify/hydrogen': minor
'create-hydrogen-app': minor
---

Starting from SF API version `2022-04`, the preferred way to request translatable resources is using the `@inContext` directive. See the [API docs](https://shopify.dev/api/examples/multiple-languages#retrieve-translations-with-the-storefront-api) on how to do this and which resources have translatable properties.

This causes a breaking change to the `useShopQuery` hook. The `locale` property has been removed from the argument object; `Accept-Language` is no longer being send with every request, and we are no longer using locale as part of the cache key.

The `useShop` hook will now return the `languageCode` key, which is the first two characters of the existing `locale` key.

Both `locale` & `languageCode` values are also now capitalized to make it easier to pass into a GraphQL `@inContext` directive.
