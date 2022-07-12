---
'@shopify/hydrogen': patch
---

Serve assets in `public` directory from the same origin when deploying to Oxygen.

Normally, public assets are served from a CDN domain that is different from the storefront URL. This creates issues in some situations where the assets need to be served from the same origin, such as when using service workers in PWA or tools like Partytown. This change adds a proxy so that the browser can download assets from the same origin.

Note that, for performance reasons, it is still recommended placing assets in `/src/assets` instead of `/public` whenever possible.
