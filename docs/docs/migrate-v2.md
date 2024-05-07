---
slug: /migrate
---

# Migrate from Hydrogen v1 to v2

The recommended method for upgrading from Hydrogen v1 to  is to [create a new Hydrogen project](https://shopify.dev/docs/custom-storefronts/hydrogen/getting-started) and transfer required features and assets manually.

## Key differences between Hydrogen v1 and Hydrogen v2

- Hydrogen now [uses Remix as its foundational framework](https://hydrogen.shopify.dev/update/remixing-hydrogen). Remix promotes server-side rendering, web standard technologies, and principles of progressive enhancement to boost site performance. Hydrogen provides a collection of components, utilities, and design patterns that make it easier and more performant to work with Shopify APIs.
- Hydrogen no longer uses React Server Components. Use [Remix loader functions](https://remix.run/docs/en/main/route/loader) instead.
- Since version 2023.1, Hydrogen has been [calendar versioned](https://calver.org/). This keeps Hydrogen's features in sync with Shopify's [API versioning](https://shopify.dev/docs/api/usage/versioning).

To quickly get up to speed on Remix, we recommend completing its [30-minute introductory tutorial](https://remix.run/docs/en/main/start/tutorial).

## Routes

Remix uses [nested routes](https://remix.run/docs/en/main/discussion/routes) to define the site path.

Hydrogen's default [Skeleton template](https://github.com/Shopify/hydrogen/tree/main/templates/skeleton) includes all of Shopify's standard storefront routes. When setting up a new Hydrogen project, select the option to "scaffold routes and core functionality" to set up these routes autoatically.

You can also scaffold routes after the fact by [using the Hydrogen CLI](https://shopify.dev/docs/api/shopify-cli/hydrogen/hydrogen-generate-routes):

```sh
# Run in your new Hydrogen project
npx shopify hydrogen generate routes
```

For reference, this table compares some typical Hydrogen v1 route files with their Remix equivalents. However, we don't recommend creating every file manually; the `generate routes` command is the most reliable method to create consistent results.

| **Hydrogen v1**                 | **Hydrogen with Remix** |
| ------------------------------- | ----------------------- |
| index.html                      | root.jsx
| robots.txt.server.js            | [robots.txt].jsx        |
| sitemap.xml.server.ts           | [sitemap.xml].jsx       |
| products/[handle].server.jsx    | products.$handle.jsx    |
| policies/[handle].server.jsx    | policies.$handle.jsx    |
| collections/[handle].server.jsx | collections.$handle.jsx |
| pages/[handle].server.jsx       | pages.$handle.jsx       |


### API routes

In Remix, instead of a separate pattern for API routes, `loader` and `action` functions serve as the same purpose — [routes are their own API](https://remix.run/docs/en/main/guides/api-routes#routes-are-their-own-api).

### 404 route

Hydrogen v1 handled 404 pages with a wildcard route defined in `App.server.jsx`. Remix also needs a wildcard route; in Remix, these are called [Splat Routes](https://remix.run/docs/en/main/file-conventions/routes#splat-routes).

A standard 404 route is generated when setting up a new Hydrogen project if you opt to [scaffold the standard routes](#routes). Consult the Skeleton template's [404 route file on GitHub](https://github.com/Shopify/hydrogen/blob/main/templates/skeleton/app/routes/%24.tsx) if you want to set it up yourself.

## Moving static assets

Remix features two directories that can contain static assets:

1. `public` is for static files that should be uploaded directly to Shopify's CDN without being processed by Vite. Files in this directory will be available relative to the site root when deployed. You can hard-code their paths in site files.
1. `app/assets` is for static files that will be imported in your site files and will be processed by Vite. File names may be hashed and the files themselves may be optimized or bundled during the build process.

### CSS

Remix uses Vite for bundling and optimization, so all of [Vite's standard CSS methods](https://vitejs.dev/guide/features#css) are available in Hydrogen.

