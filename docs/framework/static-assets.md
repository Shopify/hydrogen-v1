---
gid: f0257fae-85fc-4199-a74e-aa9e0a32d99c
title: Static assets
description: Learn how to reference and serve static assets in Hydrogen.
---

When building your custom storefront, it can be useful to have access to static assets that aren't already hosted elsewhere, like images. This guide describes how to reference and serve static assets in Hydrogen.

## How static assets work

Static assets are files that your app downloads from a server. In Hydrogen, you import a static asset into your JavaScript runtime as a URL. When you import a static asset, it returns the resolved public URL where the asset is served.

The following example shows how to render the `/src/icon.png` image:

{% codeblock file, filename: "src/components/Hero.client.jsx" %}

```js
import icon from '../icon.png';
import {Image} from '@shopify/hydrogen';

export default function Hero() {
  return <Image src={icon} width="100" height="50" />;
}
```

{% endcodeblock %}

> Tip:
> You can also import static assets as an explicit URL or as a string. For more information, refer to [Vite's guide](https://vitejs.dev/guide/assets.html#explicit-url-imports).

### Static assets in Oxygen

If you're [using Oxygen to deploy your Hydrogen custom storefront](https://shopify.dev/custom-storefronts/hydrogen/deployment#deploy-to-oxygen), then static assets are automatically deployed to Shopify's content delivery network (CDN).

Shopify provides merchants with a world-class CDN backed by [Cloudflare](https://cloudflare.com/). Using a CDN means that your custom storefront will load quickly around the globe.

Files delivered over the Shopify CDN are minified and compressed automatically using [Brotli](https://github.com/google/brotli), [Zopfli](https://github.com/google/zopfli), and [gzip](https://en.wikipedia.org/wiki/Gzip), reducing the size of the files the browser must download. Requests use [HTTP/3](https://developers.cloudflare.com/http3/) and [TLS 1.3](https://www.cloudflare.com/learning-resources/tls-1-3/) to further enhance request performance and security.

## Change the base URL

If you want to serve your static assets from a different domain or path, then you can specify the `HYDROGEN_ASSET_BASE_URL` environment variable when building your project.

For example, running the following command will cause references to `/icon.png` to instead reference `https://mycdn.example/path/to/folder/icon.png` in the compiled code.

{% codeblock terminal %}

```bash
$ HYDROGEN_ASSET_BASE_URL=https://mycdn.example/path/to/folder yarn build
```

{% endcodeblock %}

> Note:
> Make sure to check the `dist/client/index.html` file to verify that the URLs point to the provided URL.

## Asset Versioning
When the content of your assets' haven't changed but you want to regenerate the assets already compiled, you can use this configuration, an optional string, to force all files to be recompiled with a new hash.

This can be helpful when the asset is cached but you want to change the behaviour of your cache or the response headers that are currently cached like in a CDN or user's browser.

{% codeblock terminal %}

```js
// vite.config.js
export default {
  plugins: [hydrogen({assetHashVersion: 'v2'})]
}
```

{% endcodeblock %}

## Considerations and limitations

You should only import assets, such as styles or images, from [client components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components#component-types). Any static assets that are referenced in server components, or shared components that are rendered from server components, won't display in the browser.

## Next steps

- Learn about [React Server Components](https://shopify.dev/custom-storefronts/hydrogen/framework/react-server-components), an opinionated data-fetching and rendering workflow for React apps.
- Learn how to [deploy your Hydrogen storefront](https://shopify.dev/custom-storefronts/hydrogen/deployment) to Oxygen and other runtimes.
