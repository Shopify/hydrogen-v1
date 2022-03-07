<aside class="note beta">
<h4>Developer preview</h4>

<p>This is a developer preview of Hydrogen. The documentation will be updated as Shopify introduces <a href="https://github.com/Shopify/hydrogen/releases">new features and refines existing functionality</a>.</p>

</aside>

Hydrogen contains a set of Shopify-specific commerce components, hooks, and utilities that help accelerate your development process. This guide provides a complete reference of the components, hooks, and utilities that Hydrogen offers, and their relationships to each other.

## Primitive components and hooks

Primitive components and hooks are the building blocks for different component types, including products, variants, and cart.

<table>
  <tr>
    <th>Component name</th>
    <th>Description</th>
    <th>Related hooks</th>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/primitive/externalvideo">ExternalVideo</a></td>
    <td>Renders an embedded video for the Storefront API's <a href="/api/storefront/reference/products/externalvideo"> ExternalVideo object</a>.</td>
    <td>Not applicable</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/primitive/image">Image</a></td>
    <td>Renders an image for the Storefront API's <a href="/api/storefront/reference/common-objects/image">Image object</a>.</td>
    <td>Not applicable</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/primitive/mediafile">MediaFile</a></td>
    <td>Renders the media for the Storefront API's <a href="/api/storefront/reference/products/media">Media object</a>. It either renders an <code>Image</code>, a <code>Video</code>, an <code>ExternalVideo</code>, or a <code>ModelViewer</code> depending on the <code>mediaContentType</code> of the media provided as a prop.</td>
    <td>Not applicable</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/primitive/modelviewer">ModelViewer</a></td>
    <td>Renders a 3D model (with the <code>model-viewer</code> tag) for the Storefront API's <a href="/api/storefront/reference/products/model3d">Model3d object</a>.</td>
    <td>Not applicable</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/primitive/money">Money</a></td>
    <td>Renders a string of the Storefront API's <a href="/api/storefront/reference/common-objects/moneyv2">MoneyV2 object</a>.</td>
    <td><a href="/api/hydrogen/hooks/primitive/usemoney">useMoney</a></td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/primitive/metafield">Metafield</a></td>
    <td>Renders the value of the Storefront API's <a href="/api/storefront/reference/common-objects/metafield">Metafield object</a>.</td>
    <td>Not applicable</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/primitive/seo">Seo</a></td>
    <td>Renders SEO information on a webpage.</td>
    <td>Not applicable</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/primitive/shoppaybutton">ShopPayButton</a></td>
    <td>Renders a button that redirects to the Shop Pay checkout.</td>
    <td>Not applicable</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/primitive/unitprice">UnitPrice</a></td>
    <td>Renders a string of a unit price.</td>
    <td><a href="/api/hydrogen/hooks/usemoney">useMoney</a></td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/primitive/video">Video</a></td>
    <td>Renders a <code>video</code> for the Storefront API's <a href="/api/storefront/reference/products/video">Video object</a>.</td>
    <td>Not applicable</td>
  </tr>
</table>

## Global components and hooks

Global components wrap around your entire app. Hydrogen includes the [ShopifyProvider](/api/hydrogen/components/global/shopifyprovider) component. The `ShopifyProvider` component relates to the following hooks that are used to fetch data from server components:

<table>
  <tr>
    <th>Hook name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/global/useserverstate">useServerState</a></td>
    <td><a href="/custom-storefronts/hydrogen/framework/server-state">Manages the server state</a> when using Hydrogen as a React Server Component framework.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/global/useshop">useShop</a></td>
    <td>Accesses values within <code>shopify.config.js</code>.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/global/useshopquery">useShopQuery</a></td>
    <td>Makes server-only GraphQL queries to the <a href="/api/storefront">Storefront API</a>.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/global/usequery">useQuery</a></td>
    <td>Executes an asynchronous operation like <code>fetch</code> in a way that supports <a href="https://reactjs.org/docs/concurrent-mode-suspense.html">Suspense</a>.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/global/useurl">useUrl</a></td>
    <td>Retrieves the current URL in a server or client component.</td>
  </tr>
</table>

## Product and variant components and hooks

Product and variant components and hooks relate to the goods, digital downloads, services, and gift cards that a merchant sells. If a product has options, like size or color, then merchants can add a variant for each combination of options.

<table>
  <tr>
    <th>Component name</th>
    <th>Description</th>
    <th>Related hooks</th>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/product-variant/productdescription">ProductDescription</a></td>
    <td>Renders a <code>div</code> component with the product's <a href="/api/storefront/reference/products/product">descriptionHtml</a>.</td>
    <td>Not applicable</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/product-variant/productmetafield">ProductMetafield</a></td>
    <td>Renders a <code>Metafield</code> component with a product <a href="/api/storefront/reference/common-objects/metafield">metafield</a>.</td>
    <td>Not applicable</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/product-variant/productprice">ProductPrice</a></td>
    <td>Renders a <code>Money</code> component with the product <a href="/api/storefront/reference/products/product">priceRange</a>'s <code>maxVariantPrice</code> or <code>minVariantPrice</code>, or the product <a href="/api/storefront/reference/products/product">compareAtPriceRange</a>'s <code>maxVariantPrice</code> or <code>minVariantPrice</code>.</td>
    <td>Not applicable</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/product-variant/productprovider">ProductProvider</a></td>
    <td>Sets up a context with product details.</td>
    <td><a href="/api/hydrogen/hooks/product-variant/useproduct">useProduct</a></td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/product-variant/producttitle">ProductTitle</a></td>
    <td>Renders a <code>span</code> element with the product's title.</td>
    <td>Not applicable</td>
  </tr>
</table>

## Cart components and hooks

Cart components and hooks relate to the merchandise that a customer intends to purchase.

<table>
  <tr>
    <th>Component name</th>
    <th>Description</th>
    <th>Related hooks</th>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/addtocartbutton">AddToCartButton</a></td>
    <td>Renders a button that adds an item to the cart when pressed.</td>
    <td>Not applicable</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/buynowbutton">BuyNowButton</a></td>
    <td>Renders a button that adds an item to the cart and immediately redirects the buyer to checkout.</td>
    <td>Not applicable</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartcheckoutbutton">CartCheckoutButton</a></td>
    <td>Renders a button that redirects to the checkout URL for the cart.</td>
    <td><a href="/api/hydrogen/hooks/cart/usecart">useCart</a></td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartestimatedcost">CartEstimatedCost</a></td>
    <td>Renders a <code>Money</code> component for various amount types related to cart.</td>
    <td><a href="/api/hydrogen/hooks/cart/usecart">useCart</a></td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartlineimage">CartLineImage</a></td>
    <td>Renders an <code>Image</code> component for the cart line merchandise's image.</td>
    <td>Not applicable</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartlineprice">CartLinePrice</a></td>
    <td>Renders a <code>Money</code> component for the cart line merchandise's regular or compare at price.</td>
    <td>Not applicable</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartlineproducttitle">CartLineProductTitle</a></td>
    <td>Renders a <code>span</code> element (or the type of HTML element specified by the <code>as</code> prop) with the cart line merchandise's title.</td>
    <td>Not applicable</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartlineprovider">CartLineProvider</a></td>
    <td>Creates a context for using a cart line.</td>
    <td><a href="/api/hydrogen/hooks/cart/usecartline">useCartLine</a></td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartlinequantity">CartLineQuantity</a></td>
    <td>Renders a <code>span</code> element (or the type of HTML element specified by the <code>as</code> prop) with the cart line's quantity.</td>
    <td>Not applicable</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartlinequantityadjustbutton">CartLineQuantityAdjustButton</a></td>
    <td>Renders a button that adjusts the cart line's quantity when pressed.</td>
    <td>Not applicable</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartlines">CartLines</a></td>
    <td>Iterates over each cart line and renders its children within a <code>CartLineProvider</code> for each cart line.</td>
    <td><a href="/api/hydrogen/hooks/cart/usecartline">useCartLine</a></td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartprovider">CartProvider</a></td>
    <td>Creates a context for using a cart.</td>
    <td><a href="/api/hydrogen/hooks/cart/usecart">useCart</a></td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartshoppaybutton">CartShopPayButton</a></td>
    <td>Renders a <code>ShopPayButton</code> for the items in the cart.</td>
    <td>Not applicable</td>
  </tr>
</table>

## Localization components and hooks

Localization components and hooks relate to creating shopping experiences for a global audience in local languages and currencies. Hydrogen includes a [LocalizationProvider](/api/hydrogen/components/localization/localizationprovider) component.
The `LocalizationProvider` component relates to the following localization hooks:

<table>
  <tr>
    <th>Hook name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/localization/useavailablecountries">useAvailableCountries</a></td>
    <td>Returns an array of the available countries used for localization purposes.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/localization/usecountry">useCountry</a></td>
    <td>Returns a tuple of the current localization country and a function for updating it.</td>
  </tr>
</table>

## Metafield components and hooks

Metafield components and hooks relate to attaching specialized information to Shopify resources, such as part numbers or release dates.

<table>
  <tr>
    <th>Name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/primitive/metafield">Metafield</a></td>
    <td>Renders the value of the <a href="/api/storefront/reference/common-objects/metafield">Metafield object</a>.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/metafield/useparsedmetafields">useParsedMetafields</a></td>
    <td>Returns an array of parsed metafields.</td>
  </tr>
</table>

## Utilities

Hydrogen includes the following utilities to help speed up your development process:

<table>
  <tr>
    <th>Utility name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/utilities/flattenconnection">flattenConnection</a></td>
    <td>Transforms a connection object into a flat array.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/utilities/isclient">isClient</a></td>
    <td>Indicates if the code executed on the client.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/utilities/isserver">isServer</a></td>
    <td>Indicates if the code executed on the server.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/utilities/log">log</a></td>
    <td>Logs debugging, warning, and error information about the application.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/utilities/parsemetafieldvalue">parseMetafieldValue</a></td>
    <td>Parses a metafield's value from a string to a sensible type corresponding to the metafield's type.</td>
  </tr>
</table>
