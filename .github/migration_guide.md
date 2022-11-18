# Migration guide

This file is a living document that gathers required changes to user applications for every release. These changes must be applied incrementally: when upgrading from version A to C, changes for version B must also be considered unless stated otherwise. If a version is missing from this guide, it should be safe to upgrade without changing the app code.

<!-- DO NOT update this file. Instead, include migration steps in your Changeset -->

## 0.11.0 - 2022-02-24

### `shopify.config.js`

Hydrogen now implements the 2022-01 version of the Storefront API. [Update your `shopify.config.js` file](https://shopify.dev/custom-storefronts/hydrogen/getting-started/create#step-2-update-information-about-your-shopify-storefront) to use the `2022-01` `storefrontApiVersion` instead of `unstable`.

### `<ShopifyProvider>`

Our 0.10 release removed `<ShopifyProvider>`. This was necessary because React Server Components do not currently support Context. That change also meant that you could only have a single Shopify configuration for your app. The config was global. After making this change, we received feedback, internally and externally, that there is value in being able to dynamically define the configuration per request. This is useful to aggregate multiple storefronts with a single Hydrogen app.

Because of these requests, we are bringing `<ShopifyProvider>` back. The challenge is that context is still not supported in React Server Components. Because of this, the new `<ShopifyProvider>` is special with a few shortcomings:

1. You cannot have _multiple_ instances of `<ShopifyProvider>` within your app. Because it is not using real context, all `<ShopifyProvider>` instances share the same configuration per request.
1. You are still able to dynamically define the `shopifyConfig` prop, and it will become isolated per request to the server, being thread safe.

Again, you cannot yet use context within your server components. We are working with Meta and hope to have a long term server context solution soon.

#### Migrate from Hydrogen version 0.10.0

1. Remove `shopifyConfig` from both `entry-client.jsx` and `entry-server.jsx`.
1. Add `ShopifyProvider` and `shopifyConfig` to `App.server.jsx`:

```diff
- import {DefaultRoutes} from '@shopify/hydrogen';
+ import {DefaultRoutes, ShopifyProvider} from '@shopify/hydrogen';
  import {Suspense} from 'react';

+ import shopifyConfig from '../shopify.config';
  import DefaultSeo from './components/DefaultSeo.server';
  import NotFound from './components/NotFound.server';
  import AppClient from './App.client';
  import LoadingFallback from './components/LoadingFallback';
  import {ShopifyProvider} from '@shopify/hydrogen';

  export default function App({log, pages, ...serverState}) {
    return (
      <Suspense fallback={<LoadingFallback />}>
+      <ShopifyProvider shopifyConfig={shopifyConfig}>
          <AppClient helmetContext={serverState.helmetContext}>
            <DefaultSeo />
            <DefaultRoutes
              pages={pages}
              serverState={serverState}
              log={log}
              fallback={<NotFound />}
            />
          </AppClient>
+      </ShopifyProvider>
      </Suspense>
    );
  }

```

### React Router is completely gone

In version 0.10, we removed React Router on the server. With this release, we have removed React Router on the client as well. In most scenarios this shouldn't be a breaking change, unless you directly use React Router hooks or components within your client components. Simply remove `react-router-dom` from your package.json dependencies. Hydrogen exposes the following utilities for routing:

1. [`<Link>` component](https://shopify.dev/custom-storefronts/hydrogen/routing#related-components-and-hooks)
2. [`useNavigate` hook](https://shopify.dev/custom-storefronts/hydrogen/routing#related-components-and-hooks)
3. [`useUrl` hook](https://shopify.dev/api/hydrogen/hooks/global/useurl)

In a later release, we'll continue to enhance the routing capabilities in Hydrogen. Read more in the [Custom Routes RFC](https://github.com/Shopify/hydrogen/discussions/569).

### Renamed `Model3D` to `ModelViewer`

The `<Model3D />` component has now been renamed to [`<ModelViewer />`](https://shopify.dev/api/hydrogen/components/primitive/modelviewer).

### Standalone Cart hooks removed

The following Cart hooks were removed because the same functionality can be obtained through the [`useCart` hook](https://shopify.dev/api/hydrogen/hooks/cart/usecart):

- `useCartAttributesUpdateCallback`
- `useCartBuyerIdentityUpdateCallback`
- `useCartCheckoutUrl`
- `useCartCreateCallback`
- `useCartDiscountCodesUpdateCallback`
- `useCartLinesAddCallback`
- `useCartLinesRemoveCallback`
- `useCartLinesTotalQuantity`
- `useCartLinesUpdateCallback`
- `useCartNoteUpdateCallback`

#### Example

```diff
- import {useCartCheckoutUrl} from '@shopify/hydrogen'
+ import {useCart} from '@shopify/hydrogen'

- const checkoutUrl = useCartCheckoutUrl()
+ const {checkoutUrl} = useCart()
```

### Render props removed

The following components no longer allow the `function-as-a-child` (also known as "render props") pattern; see #589.

- `<Money>`: Use [`useMoney`](https://shopify.dev/api/hydrogen/hooks/primitive/usemoney) for customization.
- `<CartLinePrice>`: Use [`useMoney`](https://shopify.dev/api/hydrogen/hooks/primitive/usemoney) for customization.
- `<ProductPrice>`: Use [`useMoney`](https://shopify.dev/api/hydrogen/hooks/primitive/usemoney) for customization.
- `<SelectedVariantPrice>`: Use [`useMoney`](https://shopify.dev/api/hydrogen/hooks/primitive/usemoney) for customization.
- `<Metafield>`: Use [`useParsedMetafields`](https://shopify.dev/api/hydrogen/hooks/metafield/useparsedmetafields) for customization.
- `<ProductMetafield>`: Use [`useParsedMetafields`](https://shopify.dev/api/hydrogen/hooks/metafield/useparsedmetafields) for customization.
- `<SelectedVariantMetafield>`: Use [`useParsedMetafields`](https://shopify.dev/api/hydrogen/hooks/metafield/useparsedmetafields) for customization.
- `<UnitPrice>`: Use [`useMoney`](https://shopify.dev/api/hydrogen/hooks/primitive/usemoney) for customization.
- `<CartLines>`: Use [`useCart`](https://shopify.dev/api/hydrogen/hooks/cart/usecart) for customization.

#### Example

```diff
-import {Money} from '@shopify/hydrogen/client';
+import {useMoney} from '@shopify/hydrogen/client';

export default function MoneyCompareAtPrice({money}) {
+ const {amount, currencyNarrowSymbol} = useMoney(money);
  return (
-   <Money money={money}>
-     {({amount, currencyNarrowSymbol}) => (
       <span className="line-through text-lg mr-2.5 text-gray-500">
         {currencyNarrowSymbol}
         {amount}
       </span>
-     )}
-   </Money>
  );
}
```

### Product and Cart component aliases removed

The following aliases have been removed. Use each component's original name:

- `Product`: Use [`ProductProvider`](https://shopify.dev/api/hydrogen/components/product-variant/productprovider) instead.
- `Product.Description`: Use [`ProductDescription`](https://shopify.dev/api/hydrogen/components/product-variant/productdescription) instead.
- `Product.Price`: Use [`ProductPrice`](https://shopify.dev/api/hydrogen/components/product-variant/productprice) instead.
- `Product.Title`: Use [`ProductTitle`](https://shopify.dev/api/hydrogen/components/product-variant/producttitle) instead.
- `Product.Metafield`: Use [`ProductMetafield`](https://shopify.dev/api/hydrogen/components/product-variant/productmetafield) instead.
- `Product.SelectedVariant.AddToCartButton`: Use [`SelectedVariantAddToCartButton`](https://shopify.dev/api/hydrogen/components/product-variant/selectedvariantaddtocartbutton) instead.
- `Product.SelectedVariant.BuyNowButton`: Use [`SelectedVariantBuyNowButton`](https://shopify.dev/api/hydrogen/components/product-variant/selectedvariantbuynowbutton) instead.
- `Product.SelectedVariant.ShopPayButton`: Use [`SelectedVariantShopPayButton`](https://shopify.dev/api/hydrogen/components/product-variant/selectedvariantshoppaybutton) instead.
- `Product.SelectedVariant.Price`: Use [`SelectedVariantPrice`](https://shopify.dev/api/hydrogen/components/product-variant/selectedvariantprice) instead.
- `Product.SelectedVariant.Image` Use [`SelectedVariantImage`](https://shopify.dev/api/hydrogen/components/product-variant/selectedvariantimage) instead.
- `Product.SelectedVariant.UnitPrice`: Use [`SelectedVariantUnitPrice`](https://shopify.dev/api/hydrogen/components/product-variant/selectedvariantunitprice) instead.
- `Product.SelectedVariant.Metafield`: Use [`SelectedVariantMetafield`](https://shopify.dev/api/hydrogen/components/product-variant/selectedvariantmetafield) instead.
- `Cart`: Use [`CartProvider`](https://shopify.dev/api/hydrogen/components/cart/cartprovider) instead.
- `CartLine.Image`: Use [`CartLineImage`](https://shopify.dev/api/hydrogen/components/cart/cartlineimage) instead.
- `CartLine.Price`: Use [`CartLinePrice`](https://shopify.dev/api/hydrogen/components/cart/cartlineprice) instead.
- `CartLine.ProductTitle`: Use [`CartLineProductTitle`](https://shopify.dev/api/hydrogen/components/cart/cartlineproducttitle) instead.
- `CartLine.Quantity`: Use [`CartLineQuantity`](https://shopify.dev/api/hydrogen/components/cart/cartlinequantity) instead.
- `CartLine.QuantityAdjustButton`: Use [`CartLineQuantityAdjustButton`](https://shopify.dev/api/hydrogen/components/cart/cartlinequantityadjustbutton) instead.
- `CartLine.SelectedOptions`: Use [`CartLineSelectedOptions`](https://shopify.dev/api/hydrogen/components/cart/cartlineselectedoptions) instead.
- `CartLine.Attributes`: Use [`CartLineAttributes`](https://shopify.dev/api/hydrogen/components/cart/cartlineattributes) instead.

#### Example

```diff
- import {Product} from '@shopify/hydrogen'
+ import {ProductProvider, ProductImage} from '@shopify/hydrogen'

- <Product>
-   <Product.Image/>
- </Product>
+ <ProductProvider>
+  <ProductImage/>
+ </ProductProvider>
```

### `Seo` component now comes from `@shopify/hydrogen`

Before this release, the `Seo` component could be found in `/src/components/Seo.client.jsx`. We've since enhanced this component and moved it into `@shopify/hydrogen`. Refer to the [`Seo` component reference](https://shopify.dev/api/hydrogen/components/primitive/seo).

We recommend updating the following files:

#### `/src/components/DefaultSeo.server.jsx`

```diff
- import Seo from './Seo.client';
+import {Seo} from '@shopify/hydrogen';

 const {
    data: {
-      shop: {name: shopName},
+      shop: {name: shopName, description: shopDescription},
    },
  } = useShopQuery({
    query: QUERY,
    cache: {maxAge: 60 * 60 * 12, staleWhileRevalidate: 60 * 60 * 12},
  });

- <Seo shopName={shopName} />
+ <Seo type="defaultSeo" data={{title: shopName, description: shopDescription}} />

...
const QUERY = gql`
  query shopName {
    shop {
      name
+     description
    }
  }
`;
```

#### `src/components/ProductDetails.client.jsx`

```diff
- import Seo from './Seo.client';
...
- <Seo product={product} />
```

#### `src/pages/products/[handle].server.jsx`

```diff
+import {Seo} from '@shopify/hydrogen';
...
return (
    <Layout>
+    <Seo type="product" data={data.product} />
      <ProductDetails product={data.product} />
    </Layout>
  );
...
 product: product(handle: $handle) {
      id
+    description
      vendor
      seo {
        title
        description
      }
-      images(first: 1) {
-        edges {
-          node {
-            url
-          }
-        }
+     featuredImage {
+        url
+        height
+        width
+        altText
      }
      ...ProductProviderFragment
    }
```

Additionally, consider adding the `Seo` component to the following places using the current demo store as a reference:

- **Home page**: [`src/pages/index.server.jsx`](https://github.com/Shopify/hydrogen/blob/8ea40b5e119883ca380406edc123d9cb10ca8650/examples/demo-store/src/pages/index.server.jsx#L22)
- **Collections route**: [`/src/pages/collections/[handle].server.jsx`](https://github.com/Shopify/hydrogen/blob/8ea40b5e119883ca380406edc123d9cb10ca8650/examples/demo-store/src/pages/collections/[handle].server.jsx#L42)
- **Pages route**: [`/src/pages/pages/[handle].server.jsx`](https://github.com/Shopify/hydrogen/blob/8ea40b5e119883ca380406edc123d9cb10ca8650/examples/demo-store/src/pages/pages/[handle].server.jsx#L19)

Learn more about [how SEO works in Hydrogen](https://shopify.dev/custom-storefronts/hydrogen/seo).

### Entry points have been simplified

We have removed `/src/entry-server.jsx` and `/src/entry-client.jsx` from the default template. We have also removed `Dockerfile`, `server.js` and `worker.js` from the default template in favor of Hydrogen-provided runtime files.

To update, merge the contents of `/src/entry-server.jsx` into `App.server.jsx`. The latter becomes the new default entry point for the server environment:

```diff
+import renderHydrogen from '@shopify/hydrogen/entry-server';
import {DefaultRoutes, ShopifyProvider} from '@shopify/hydrogen';
import shopifyConfig from '../shopify.config';
// ...

- export default function App({log, pages, ...serverState}) {
+ function App({log, pages, ...serverState}) {
  return ({/* ... */});
}

+ const pages = import.meta.globEager('./pages/**/*.server.[jt](s|sx)');
+ export default renderHydrogen(App, {pages});
```

Hydrogen now provides a simplified approach for deploying to different platforms, like Node.js and Workers by introducing `@shopify/hydrogen/platforms/node` and `@shopify/hydrogen/platforms/worker-event` helpers.

If you have not modified a local version of `server.js` or `worker.js`, you can update the `package.json` scripts to:

```diff
  "build:client": "vite build --outDir dist/client --manifest",
- "build:server": "vite build --outDir dist/server --ssr src/entry-server.jsx",
- "build:worker": "cross-env WORKER=true vite build --outDir dist/worker --ssr worker.js",
- "serve": "node --enable-source-maps server",
+ "build:server": "vite build --outDir dist/server --ssr @shopify/hydrogen/platforms/node",
+ "build:worker": "cross-env WORKER=true vite build --outDir dist/worker --ssr @shopify/hydrogen/platforms/worker-event",
+ "serve": "node --enable-source-maps dist/server",
```

If you have a custom `worker.js` file, `renderHydrogen` now returns a `handleRequest` function that must be called once per request. Therefore, you must use it directly instead of importing `handleEvent`.

```diff
// worker.js
- import handleEvent from '@shopify/hydrogen/worker';
- import entrypoint from './src/entry-server.jsx';
+ import handleRequest from './src/App.server';
import indexTemplate from './dist/client/index.html?raw';

// ...

    event.respondWith(
-       handleEvent(event, {indexTemplate, entrypoint, assetHandler, context: event})
+       handleRequest(event.request, {indexTemplate, context: event})
    )
```

Furthermore, the new `handleRequest` function does not have access to static assets anymore (`assetHandler` parameter has also been removed). Therefore, we must handle assets manually in our worker. For example, when deploying to Cloudflare Workers, use the `@cloudflare/kv-asset-handler` package:

```js
import {getAssetFromKV} from '@cloudflare/kv-asset-handler';
// ...
event.respondWith(
  isAsset(event) ? getAssetFromKv(event) : handleRequest(event.request, {})
);
```

**[Read more about deployment and building for Node.js, Workers, and Docker platforms](https://github.com/Shopify/hydrogen/blob/367b89ae917b4b938318b8fde86846e2191ed204/docs/framework/deployment.md)**

Finally, remove `/src/entry-client.jsx` and update `index.html` (optional):

```diff
  <body>
    <div id="root"></div>
-   <script type="module" src="/src/entry-client.jsx"></script>
+   <script type="module" src="/@shopify/hydrogen/entry-client"></script>
  </body>
```

Any stylesheet imported in `/src/entry-client.jsx` can directly be imported in `index.html` using `<link>` tags.

### Removed <SelectedVariantX /> components ([Issue 592](https://github.com/Shopify/hydrogen/issues/592))

The components prefixed with `SelectedVariant` have been removed and we have made modifications to the corresponding non-`SelectedVariant` component counterparts to support better default functionality. For example, `<SelectedVariantAddToCartButton />` has been removed and `<AddToCartButton />` will now use the `selectedVariant` by default when no `variantId` prop is provided. A full list of the changes can be found in [Issue 592](https://github.com/Shopify/hydrogen/issues/592).

### Components renamed props that takes in Storefront API object as `data`

See [#627](https://github.com/Shopify/hydrogen/issues/627) for more details, but here are all the components with breaking change in prop name.

```diff
- <ExternalVideo video={firstMediaElement} />
+ <ExternalVideo data={firstMediaElement} />
```

```diff
- <Video video={firstMediaElement}/>
+ <Video data={firstMediaElement}/>
```

```diff
- <Image width="622" height="465" image={collection.image} />
+ <Image width="622" height="465" data={collection.image} />
```

```diff
- <MediaFile media={product.node.media.edges[0].node} />
+ <MediaFile data={product.node.media.edges[0].node} />
```

```diff
- <ModelViewer model={firstMediaElement} />
+ <ModelViewer data={firstMediaElement} />
```

```diff
- <Metafield metafield={metafield} />
+ <Metafield data={metafield} />
```

```diff
- <Money money={amount} />
+ <Money data={amount} />
```

```diff
- <UnitPrice unitPrice={product.selectedVariant.unitPrice} unitPriceMeasurement={product.selectedVariant.unitPriceMeasurement} />
+ <UnitPrice data={product.selectedVariant.unitPrice} measurement={product.selectedVariant.unitPriceMeasurement} />
```

```diff
- <ProductProvider product={product} initialVariantId={initialVariant.id}>
+ <ProductProvider data={product} initialVariantId={initialVariant.id}>
```

```diff
- <CartProvider cart={CART_WITH_LINES}>
+ <CartProvider data={CART_WITH_LINES}>
```

### Helmet component has been renamed to Head

We renamed the Helmet component that's exported from `@shopify/hydrogen/client`. Update your imports to reference `<Head>` instead of `<Helmet>`. Refer to [#720](https://github.com/Shopify/hydrogen/issues/720) for more details.

```diff
- import {Helmet} from '@shopify/hydrogen/client';
+ import {Head} from '@shopify/hydrogen/client';
```

## Older versions

Please see the the [release notes on GitHub](https://github.com/Shopify/hydrogen/releases) for more details about older versions.
