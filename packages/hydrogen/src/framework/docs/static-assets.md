When building your custom storefront, it can be useful to have access to static assets not already hosted elsewhere, like images or text documents. This guide describes how to reference and serve static assets in Hydrogen.

## How static assets work

Static assets are files your app downloads from a server. [Vite serves static assets](https://vitejs.dev/guide/assets.html) at the root path `/`. For example, you can create a file called `public/icon.png` and reference it in your code as `/icon.png`.

## Where to place static assets

You should place static assets in the `/public` directory if the following apply:

- The static asset isn't served from the Shopify database.
- The static asset isn't referenced in `robots.txt`.
- You don't want to import an asset to a JavaScript file first to get its URL.

### Example

Product images are served from the Shopify database, so you don't need to place those images in the `/public` directory. However, you might have a header for your homepage that isn't served from Shopify, so you should place that image in the `/public` directory.

## Considerations and limitations

- Don't rename the `/public` directory as it's the only directory used to serve static assets.
- Any files placed in the `/public` directory won’t include content hashes, so you need to add query arguments or rename them every time they change.

## Next steps

- Learn about [React Server Components](/api/hydrogen/framework/react-server-components), an opinionated data-fetching and rendering workflow for React apps.
- Learn how the [page server component](/api/hydrogen/framework/pages) receives props, which includes custom versions of `request` and `response`.
