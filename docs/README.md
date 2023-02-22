> ⚠️ **Important:** [Hydrogen 2.0](https://hydrogen.shopify.dev) is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please migrate to Hydrogen 2.0 as soon as possible.

## Welcome to the Hydrogen 1.0 docs

### Tutorials

[All tutorials](/docs/docs/tutorials/index.md)
- [Getting started](/docs/docs/tutorials/getting-started/index.md)
  - [Quickstart](/docs/docs/tutorials/getting-started/quickstart.md)
  - [Templates](/docs/docs/tutorials/getting-started/templates.md)
  - [Tutorial](/docs/docs/tutorials/getting-started/tutorial/index.md)
     - [Begin](/docs/docs/tutorials/getting-started/tutorial/begin.md)
     - [Cart](/docs/docs/tutorials/getting-started/tutorial/cart.md)
     - [Collections](/docs/docs/tutorials/getting-started/tutorial/collections.md)
     - [Fetch-data](/docs/docs/tutorials/getting-started/tutorial/fetch-data.md)
     - [Products](/docs/docs/tutorials/getting-started/tutorial/products.md)
- [Analytics](/docs/docs/tutorials/analytics/index.md)
  - [Configure Analytics](/docs/docs/tutorials/analytics/configure-analytics.md)
- [Authentication](/docs/docs/tutorials/authentication/index.md)
  - [Configure user authentication](/docs/docs/tutorials/authentication/configure-user-authentication.md)
- [Best practices](/docs/docs/tutorials/best-practices/index.md)
  - [Accessibility](/docs/docs/tutorials/best-practices/accessibility.md)
  - [Examples](/docs/docs/tutorials/best-practices/examples.md)
  - [Performance](/docs/docs/tutorials/best-practices/performance.md)
  - [Testing](/docs/docs/tutorials/best-practices/testing.md)
- [Configuration](/docs/docs/tutorials/configuration/index.md)
  - [Change config file location](/docs/docs/tutorials/configuration/change-config-file-location.md)
- [Content](/docs/docs/tutorials/content.md)
- [CSS support](/docs/docs/tutorials/css-support/index.md)
  - [Create custom fonts](/docs/docs/tutorials/css-support/create-custom-fonts.md)
  - [Import CSS in RSC](/docs/docs/tutorials/css-support/import-css-in-rsc.md)
  - [Remove Tailwind](/docs/docs/tutorials/css-support/remove-tailwind.md)
- [Data sources](/docs/docs/tutorials/data-sources/index.md)
  - [Configure default entry points](/docs/docs/tutorials/data-sources/configure-default-entry-points.md)
  - [Work with third-party data sources](/docs/docs/tutorials/data-sources/work-with-3p-data-sources.md)
- [Deployment](/docs/docs/tutorials/deployment.md)
- [ESlint](/docs/docs/tutorials/eslint.md)
- [Proxy routes to online store](/docs/docs/tutorials/proxy-routes-to-online-store.md)
- [Querying](/docs/docs/tutorials/querying/index.md)
  - [Cache](/docs/docs/tutorials/querying/cache.md)
  - [Manage caching](/docs/docs/tutorials/querying/manage-caching.md)
  - [Preload queries](/docs/docs/tutorials/querying/preload-queries.md)
  - [Preloaded queries](/docs/docs/tutorials/querying/preloaded-queries.md)
- [React Server Components](/docs/docs/tutorials/react-server-components/index.md)
  - [Work with RSC](/docs/docs/tutorials/react-server-components/work-with-rsc.md)
- [Routing](/docs/docs/tutorials/routing/index.md)
  - [Manage routes](/docs/docs/tutorials/routing/manage-routes.md)
- [SEO](/docs/docs/tutorials/seo/index.md)
  - [Manage SEO](/docs/docs/tutorials/seo/manage-seo.md)
- [Server props](/docs/docs/tutorials/server-props.md)
- [Sessions](/docs/docs/tutorials/sessions/index.md)
  - [Manage sessions](/docs/docs/tutorials/sessions/manage-sessions.md)
- [Static assets](/docs/docs/tutorials/static-assets/index.md)
  - [Manage static assets](/docs/docs/tutorials/static-assets/manage-static-assets.md)
- [Streaming SSR](/docs/docs/tutorials/streaming-ssr.md)
- [Third-party dependencies](/docs/docs/tutorials/third-party-dependencies.md)

### Hydrogen API reference

**Components**
- Cart
  - [`AddToCartButton`](/docs/docs/components/cart/addtocartbutton.md)
  - [`BuyNowButton`](/docs/docs/components/cart/buynowbutton.md)
  - [`CartCheckoutButton`](/docs/docs/components/cart/cartcheckoutbutton.md)
  - [`Cartcost`](/docs/docs/components/cart/cartcost.md)
  - [`CartLineImage`](/docs/docs/components/cart/cartlineimage.md)
  - [`CartLinePrice`](/docs/docs/components/cart/cartlineprice.md)
  - [`CartLineProductTitle`](/docs/docs/components/cart/cartlineproducttitle.md)
  - [`CartLineProvider`](/docs/docs/components/cart/cartlineprovider.md)
  - [`CartLineQuantity`](/docs/docs/components/cart/cartlinequantity.md)
  - [`CartLineQuantityAdjustButton`](/docs/docs/components/cart/cartlinequantityadjustbutton.md)
  - [`CartLines`](/docs/docs/components/cart/cartlines.md)
  - [`CartProvider`](/docs/docs/components/cart/cartprovider.md)
  - [`CartShopPayButton`](/docs/docs/components/cart/cartshoppaybutton.md)
- Framework
  - [`Cookie`](/docs/docs/components/framework/cookie.md)
  - [`CookieSessionStorage`](/docs/docs/components/framework/cookiesessionstorage.md)
  - [`FileRoutes`](/docs/docs/components/framework/fileroutes.md)
  - [`FileSessionStorage`](/docs/docs/components/framework/filesessionstorage.md)
  - [`Form`](/docs/docs/components/framework/form.md)
  - [`Link`](/docs/docs/components/framework/link.md)
  - [`MemorySessionStorage`](/docs/docs/components/framework/memorysessionstorage.md)
  - [`Route`](/docs/docs/components/framework/route.md)
  - [`Router`](/docs/docs/components/framework/router.md)
  - [`ShopifyAnalytics`](/docs/docs/components/framework/shopifyanalytics.md)
- Global
  - [`ShopifyProvider`](/docs/docs/components/global/shopifyprovider.md)
- Primitive
  - [`ExternalVideo`](/docs/docs/components/primitive/externalvideo.md)
  - [`Image`](/docs/docs/components/primitive/image.md)
  - [`MediaFile`](/docs/docs/components/primitive/mediafile.md)
  - [`Metafield`](/docs/docs/components/primitive/metafield.md)
  - [`ModelViewer`](/docs/docs/components/primitive/modelviewer.md)
  - [`Money`](/docs/docs/components/primitive/money.md)
  - [`Seo`](/docs/docs/components/primitive/seo.md)
  - [`ShopPayButton`](/docs/docs/components/primitive/shoppaybutton.md)
  - [`Video`](/docs/docs/components/primitive/video.md)
- Products and variants
  - [`ProductOptionsProvider`](/docs/docs/components/product-variant/productoptionsprovider.md)
  - [`ProductPrice`](/docs/docs/components/product-variant/productprice.md)
  - [`ProductProvider`](/docs/docs/components/product-variant/productprovider.md)

**Hooks**
- Cart
  - [`useCart`](/docs/docs/hooks/cart/usecart.md)
  - [`useCartLine`](/docs/docs/hooks/cart/usecartline.md)
- Framework
  - [`useFlashSession`](/docs/docs/hooks/framework/useflashsession.md)
  - [`useNavigate`](/docs/docs/hooks/framework/usenavigate.md)
  - [`useRequestContext`](/docs/docs/hooks/framework/userequestcontext.md)
  - [`useRouteparams`](/docs/docs/hooks/framework/userouteparams.md)
  - [`useSession`](/docs/docs/hooks/framework/usesession.md)
- Global
  - [`fetchSync`](/docs/docs/hooks/global/fetchsync.md)
  - [`useDelay`](/docs/docs/hooks/global/usedelay.md)
  - [`useQuery`](/docs/docs/hooks/global/usequery.md)
  - [`useServerProps`](/docs/docs/hooks/global/useserverprops.md)
  - [`useShop`](/docs/docs/hooks/global/useshop.md)
  - [`useShopQuery`](/docs/docs/hooks/global/useshopquery.md)
  - [`useUrl`](/docs/docs/hooks/global/useurl.md)
- Localization
  - [`useLocalization`](/docs/docs/hooks/localization/uselocalization.md)
- Primitive
  - [`useLoadScript`](/docs/docs/hooks/primitive/useloadscript.md)
  - [`useMoney`](/docs/docs/hooks/primitive/usemoney.md)
- Product-variant
  - [`useProduct`](/docs/docs/hooks/product-variant/useproduct.md)
  - [`useProductOptions`](/docs/docs/hooks/product-variant/useproductoptions.md)

**Utilities**
- [`flattenConnection`](/docs/docs/utilities/flattenconnection.md)
- [`gql`](/docs/docs/utilities/gql.md)
- [`isBrowser`](/docs/docs/utilities/isbrowser.md)
- [`isServer`](/docs/docs/utilities/isserver.md)
- [`log`](/docs/docs/utilities/log.md)
- [`parseMetafield`](/docs/docs/utilities/parsemetafield.md)
- [`parseMetafieldValue`](/docs/docs/utilities/parsemetafieldvalue.md)
- [`queryShop`](/docs/docs/utilities/queryshop.md)


## Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

```
$ yarn
```

### Local Development

```
$ yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
