---
gid: 30bc8c8f-2754-4483-aae1-e1a157fdb295
title: Internationalize routing
description: Learn how to set up international routing in your Hydrogen storefront.
---

[Internationalization] helps merchants expand their business to a global audience by creating shopping experiences in local languages and currencies. This guide provides information on how to set up [domains, subfolders](/custom-storefronts/hydrogen/internationalization#international-routing), and redirects for internationalized routing.

## Step 1: Set up domains and subdomains

1. [Add all of your domains and subdomains in Shopify](https://help.shopify.com/en/manual/domains/add-a-domain).

2. From your Shopify admin, under **Settings > Domains**, update your domains and subdomains to target your custom storefront. Your primary domain is used for the default URL when customers visit your store.

For non-primary domains and subdomains where you want to host a localized experience, set the domain type to **Routing**.

## Step 2: Set up subfolders

Subfolder routes use the visitor's locale in the URL path. In Hydrogen, you can use the [`FileRoutes`](/api/hydrogen/components/framework/fileroutes) component to prefix all file routes with a locale using the `basePath` parameter, and to source the corresponding file routes:

{% codeblock file, filename: 'App.server.jsx' %}

```tsx
import {
  FileRoutes,
  Route,
  Router,
  ShopifyProvider,
} from '@shopify/hydrogen';

function App({routes, request}) {
  const pathname = new URL(request.normalizedUrl).pathname;
  const localeMatch = /^\/([a-z]{2})(\/|$)/i.exec(pathname);
  const countryCode = localeMatch ? localeMatch[1] : null;

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ShopifyProvider countryCode={countryCode}>
        <CartProvider>
          <Router>
            <FileRoutes
              basePath={countryCode ? `/${countryCode}/` : null}
              routes={routes}
            />
            <Route path="*" page={<NotFound />} />
          </Router>
        </CartProvider>
      </ShopifyProvider>
    </Suspense>
  );
}
function NotFound() {
  return <h1>Not found</h1>;
}
```

{% endcodeblock %}

## Step 3: Set up redirects

After you've set up your routing strategies, you can create redirects based on your visitor's locale. You can trigger redirects manually. For example, a visitor changes their country using a dropdown menu, or automatically, based on a visitor's geolocation.

Shopify recommends manual redirects for customer privacy and SEO best practices. For example, reference the [`CountrySelector.client`](https://github.com/Shopify/hydrogen/blob/main/templates/demo-store/src/components/CountrySelector.client.tsx) component in the Hydrogen demo store.

If you're hosting your Hydrogen storefront on Oxygen, then you can access a visitor’s geolocation by using the `request` object and retrieve it using `request.headers.get()`:

{% codeblock %}

```tsx
const userCountry = request.headers.get('oxygen-buyer-country');
```

{% endcodeblock %}

[View a full list](/custom-storefronts/oxygen/worker-runtime-apis#custom-headers) of custom HTTP headers available from Oxygen.

If you're hosting your Hydrogen storefront on a platform that isn't Oxygen, then you can access the [Accept-Language](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language) HTTP header as a hint to the visitor's country and language preference:

{% codeblock %}

```tsx
const acceptLanguage = request.headers.get(‘accept-language’);
const countryCode = acceptLanguage?.replace(/-.*/, '') || undefined; // Or set a default country code. For example, 'en'.
```

{% endcodeblock %}

> Note:
> You can also consider using a third-party geolocation library, such as [`geoip-lite`](https://www.npmjs.com/package/geoip-lite).

## Next steps

- Learn how to configure other localized experiences for merchants and customers using the [GraphQL Storefront API](/api/storefront).
