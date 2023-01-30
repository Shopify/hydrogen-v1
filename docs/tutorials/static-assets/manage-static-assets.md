---
gid: 55a52d8a-bc89-4000-9f00-86cba62a7737
title: Manage static assets
description: Learn how to reference and serve static assets in Hydrogen.
---

> ⚠️ **Important:** [Hydrogen 2.0](https://hydrogen.shopify.dev) is out now. These archival docs are provided only to assist developers during their upgrade process. Please migrate to Hydrogen 2.0 as soon as possible.

When building your custom storefront, it can be useful to have access to static assets that aren't already hosted elsewhere, like images. This guide describes how to reference and serve static assets in Hydrogen.

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

## Version the assets

If asset content hasn't changed but you want to regenerate the already-compiled assets, then you can use the following configuration:

{% codeblock terminal %}

```js
// vite.config.js
export default {
  plugins: [hydrogen({assetHashVersion: 'v2'})]
}
```

{% endcodeblock %}

The configuration adds an optional string to force all files to be recompiled with a new hash. This can be helpful when the asset is cached but you want to change the behavior of your cache or the response headers that are currently cached, such as in a CDN or user's browser.
