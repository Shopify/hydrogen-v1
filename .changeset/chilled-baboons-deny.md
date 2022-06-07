---
'@shopify/hydrogen': minor
---

**Breaking change**

The utility `isClient` has been renamed to `isBrowser`. This is because the utility really checks if the running context is a browser, _not_ if the context is a client component.

All client components by default also run on the server when they are server rendered. If you don't want that to happen, use the `isBrowser()` hook. Remember that anything not server rendered will be unavailable for SEO bots.
