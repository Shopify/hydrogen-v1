# Static assets


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



When building your custom storefront, it can be useful to have access to static assets that aren't already hosted elsewhere, like images. This guide explains how static assets work and the considerations and limitations associated with them.

## How static assets work

Static assets are files that your app downloads from a server. In Hydrogen, you import a static asset into your JavaScript runtime as a URL. When you import a static asset, it returns the resolved public URL where the asset is served.

The following example shows how to render the `/src/icon.png` image:

```js
// src/components/Hero.client.jsx

import icon from '../icon.png';
import {Image} from '@shopify/hydrogen';

export default function Hero() {
  return <Image src={icon} width="100" height="50" />;
}
```



> Tip:
> You can also import static assets as an explicit URL or as a string. For more information, refer to [Vite's guide](https://vitejs.dev/guide/assets.html#explicit-url-imports).

### Static assets in Oxygen

If you're [using Oxygen to deploy your Hydrogen custom storefront](/tutorials/deployment.md#deploy-to-oxygen), then static assets are automatically deployed to Shopify's content delivery network (CDN). The assets are available through the automatically-generated URL, and also by directly using the store's domain. The following is an example:

```sh
https://cdn.shopify.com/oxygen/.../icon.png
https://example.com/icon.png
```

{% endcodeblock%}

Shopify provides merchants with a world-class CDN backed by [Cloudflare](https://cloudflare.com/). Using a CDN means that your custom storefront will load quickly around the globe.

Files delivered over the Shopify CDN are minified and compressed automatically using [Brotli](https://github.com/google/brotli), [Zopfli](https://github.com/google/zopfli), and [gzip](https://en.wikipedia.org/wiki/Gzip), reducing the size of the files the browser must download. Requests use [HTTP/3](https://developers.cloudflare.com/http3/) and [TLS 1.3](https://www.cloudflare.com/learning-resources/tls-1-3/) to further enhance request performance and security.

## Considerations and limitations

You should only import assets, such as styles or images, from [client components](/tutorials/react-server-components/index.md#component-types). Any static assets that are referenced in server components, or shared components that are rendered from server components, won't display in the browser.

## Next steps

- Learn how to perform common tasks for [managing static assets in Hydrogen](/tutorials/static-assets/manage-static-assets/).
- Learn about [React Server Components](/tutorials/react-server-components/), an opinionated data-fetching and rendering workflow for React apps.
- Learn how to [deploy your Hydrogen storefront](/tutorials/deployment/) to Oxygen and other runtimes.
