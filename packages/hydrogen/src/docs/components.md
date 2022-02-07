<aside class="note beta">
<h4>Developer preview</h4>

<p>This is a developer preview of Hydrogen. The documentation will be updated as Shopify introduces <a href="https://github.com/Shopify/hydrogen/releases">new features and refines existing functionality</a>.</p>

</aside>

Hydrogen contains a set of Shopify-specific commerce components that help accelerate your development process. This guide provides a complete reference of Hydrogen components.

## Primitive components

Primitive components are the building blocks for different component types, including products, variants, and cart. Hydrogen includes the following primitive components:

<table>
  <tr>
    <th>Component name</th>
    <th>Component type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/primitive/externalvideo">ExternalVideo</a></td>
    <td>Shared</td>
    <td>Renders an embedded video for the Storefront API's <a href="/api/storefront/reference/products/externalvideo"> ExternalVideo object</a>.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/primitive/image">Image</a></td>
    <td>Shared</td>
    <td>Renders an image for the Storefront API's <a href="/api/storefront/reference/common-objects/image">Image object</a>.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/primitive/mediafile">MediaFile</a></td>
    <td>Shared</td>
    <td>Renders the media for the Storefront API's <a href="/api/storefront/reference/products/media">Media object</a>. It either renders an <code>Image</code>, a <code>Video</code>, an <code>ExternalVideo</code>, or a <code>ModelViewer</code> depending on the <code>mediaContentType</code> of the media provided as a prop.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/primitive/metafield">Metafield</a></td>
    <td>Client</td>
    <td>Renders the value of the Storefront API's <a href="/api/storefront/reference/common-objects/metafield">Metafield object</a>.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/primitive/modelviewer">ModelViewer</a></td>
    <td>Client</td>
    <td>Renders a 3D model (with the <code>model-viewer</code> tag) for the Storefront API's <a href="/api/storefront/reference/products/model3d">Model3d object</a>.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/primitive/money">Money</a></td>
    <td>Client</td>
    <td>Renders a string of the Storefront API's <a href="/api/storefront/reference/common-objects/moneyv2">MoneyV2 object</a>.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/primitive/rawhtml">RawHtml</a></td>
    <td>Shared</td>
    <td>Renders an HTML string as HTML DOM elements.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/primitive/seo">Seo</a></td>
    <td>Shared</td>
    <td>Renders SEO information on a webpage.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/primitive/shoppaybutton">ShopPayButton</a></td>
    <td>Client</td>
    <td>Renders a button that redirects to the Shop Pay checkout.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/primitive/unitprice">UnitPrice</a></td>
    <td>Client</td>
    <td>Renders a string of a unit price.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/primitive/video">Video</a></td>
    <td>Shared</td>
    <td>Renders a <code>video</code> for the Storefront API's <a href="/api/storefront/reference/products/video">Video object</a>.</td>
  </tr>
</table>

## Global components

[ShopifyProvider](/api/hydrogen/components/global/shopifyprovider) is a global Hydrogen component that wraps your entire app. You should place it in your app's entry point component. For example, your app's entry point component might be `<App>`.

The `ShopifyProvider` component is a server component that renders inside `App.server.jsx`. For more information about component types, refer to [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components).

## Product and variant components

{% include hydrogen/products-and-variants.md %}

Hydrogen includes the following product and variant components:

<table>
  <tr>
    <th>Component name</th>
    <th>Component type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/product-variant/productdescription">ProductDescription</a><br><strong>Alias</strong>: <code>Product.Description</code></td>
    <td>Client</td>
    <td>Renders a <code>RawHtml</code> component with the product's <a href="/api/storefront/reference/products/product">descriptionHtml</a>.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/product-variant/productmetafield">ProductMetafield</a></td>
    <td>Client</td>
    <td>Renders a <code>Metafield</code> component with a product <a href="/api/storefront/reference/common-objects/metafield">metafield</a>.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/product-variant/productprice">ProductPrice</a><br><strong>Alias</strong>: <code>Product.Price</code></td>
    <td>Client</td>
    <td>Renders a <code>Money</code> component with the product <a href="/api/storefront/reference/products/product">priceRange</a>'s <code>maxVariantPrice</code> or <code>minVariantPrice</code>, or the product <a href="/api/storefront/reference/products/product">compareAtPriceRange</a>'s <code>maxVariantPrice</code> or <code>minVariantPrice</code>.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/product-variant/productprovider">ProductProvider</a><br><strong>Alias</strong>: <code>Product</code></td>
    <td>Client</td>
    <td>Sets up a context with product details.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/product-variant/producttitle">ProductTitle</a><br><strong>Alias</strong>: <code>Product.Title</code></td>
    <td>Client</td>
    <td>Renders a <code>span</code> element with the product's title.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/product-variant/selectedvariantaddtocartbutton">SelectedVariantAddToCartButton</a><br><strong>Alias</strong>: <code>Product.SelectedVariant.AddToCartButton</code></td>
    <td>Client</td>
    <td>Renders an <code>AddToCartButton</code> component for the product's selected variant.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/product-variant/selectedvariantbuynowbutton">SelectedVariantBuyNowButton</a><br><strong>Alias</strong>: <code>Product.SelectedVariant.BuyNowButton</code></td>
    <td>Client</td>
    <td>Renders a <code>BuyNowButton</code> component for the product's selected variant.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/product-variant/selectedvariantimage">SelectedVariantImage</a><br><strong>Alias</strong>: <code>Product.SelectedVariant.Image</code></td>
    <td>Client</td>
    <td>Renders an <code>Image</code> component for the product's selected variant's image.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/product-variant/selectedvariantmetafield">SelectedVariantMetafield</a></td>
    <td>Client</td>
    <td>Renders a <code>Metafield</code> component for the product's selected variant's <a href="/api/storefront/reference/common-objects/metafield">metafield</a>.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/product-variant/selectedvariantprice">SelectedVariantPrice</a><br><strong>Alias</strong>: <code>Product.SelectedVariant.Price</code></td>
    <td>Client</td>
    <td>Renders a <code>Money</code> component for the product's selected variant regular or compare at price.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/product-variant/selectedvariantshoppaybutton">SelectedVariantShopPayButton</a><br><strong>Alias</strong>: <code>Product.SelectedVariant.ShopPayButton</code></td>
    <td>Client</td>
    <td>Renders a <code>ShopPayButton</code> component for the product's selected variant.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/product-variant/selectedvariantunitprice">SelectedVariantUnitPrice</a><br><strong>Alias</strong>: <code>Product.SelectedVariant.UnitPrice</code></td>
    <td>Client</td>
    <td>Renders a <code>UnitPrice</code> component for the product's selected variant's unit price.</td>
  </tr>
</table>

## Cart components

{% include hydrogen/cart.md %}

Hydrogen includes the following cart components:

<table>
  <tr>
    <th>Component name</th>
    <th>Component type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/addtocartbutton">AddToCartButton</a></td>
    <td>Client</td>
    <td>Renders a button that adds an item to the cart when pressed.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/buynowbutton">BuyNowButton</a></td>
    <td>Shared</td>
    <td>Renders a button that adds an item to the cart and redirects the customer to checkout.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartcheckoutbutton">CartCheckoutButton</a></td>
    <td>Client</td>
    <td>Renders a button that redirects to the checkout URL for the cart.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartestimatedcost">CartEstimatedCost</a></td>
    <td>Client</td>
    <td>Renders a <code>Money</code> component for various amount types related to cart.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartlineattributes">CartLineAttributes</a><br><strong>Alias</strong>: <code>CartLine.Attributes</code></td>
    <td>Client</td>
    <td>Takes a function as a child and calls that function for each of the cart line's attributes.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartlineimage">CartLineImage</a><br><strong>Alias</strong>: <code>CartLine.Image</code></td>
    <td>Client</td>
    <td>Renders an <code>Image</code> component for the cart line merchandise's image.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartlineprice">CartLinePrice</a><br><strong>Alias</strong>: <code>CartLine.Price</code></td>
    <td>Client</td>
    <td>Renders a <code>Money</code> component for the cart line merchandise's price or compare at price.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartlineproducttitle">CartLineProductTitle</a><br><strong>Alias</strong>: <code>CartLine.ProductTitle</code></td>
    <td>Client</td>
    <td>Renders a <code>span</code> element (or the type of HTML element specified by the <code>as</code> prop) with the cart line merchandise's title.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartlineprovider">CartLineProvider</a><br><strong>Alias</strong>: <code>CartLine</code></td>
    <td>Client</td>
    <td>Creates a context for using a cart line.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartlinequantity">CartLineQuantity</a><br><strong>Alias</strong>: <code>CartLine.Quantity</code></td>
    <td>Client</td>
    <td>Renders a <code>span</code> element (or the type of HTML element specified by the as prop) with the cart line's quantity.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartlinequantityadjustbutton">CartLineQuantityAdjustButton</a><br><strong>Alias</strong>: <code>CartLine.QuantityAdjust</code></td>
    <td>Shared</td>
    <td>Renders a button that adjusts the cart line's quantity when pressed.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartlines">CartLines</a></td>
    <td>Shared</td>
    <td>Iterates over each cart line and renders its children within a <code>CartLineProvider</code> for each cart line.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartlineselectedoptions">CartLineSelectedOptions</a><br><strong>Alias</strong>: <code>CartLine.SelectedOptions</code></td>
    <td>Client</td>
    <td>Takes a function as a child and calls that function for each of the cart line merchandise's selected options.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartprovider">CartProvider</a></td>
    <td>Client</td>
    <td>Creates a context for using a cart.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartshoppaybutton">CartShopPayButton</a></td>
    <td>Client</td>
    <td>Renders a <code>ShopPayButton</code> for the items in the cart.</td>
  </tr>
</table>

## Localization components

{% include hydrogen/localization.md %}

The [LocalizationProvider](/api/hydrogen/components/localization/localizationprovider) component automatically queries the Storefront API's [`localization`](/api/storefront/reference/common-objects/queryroot) field for the ISO code, name of the country, and available countries, and keeps this information in a context. The `LocalizationProvider` component is a server component, which means that it renders on the server.

## Next steps

- [Get started](/custom-storefronts/hydrogen/getting-started/create) with Hydrogen and begin building a custom storefront.
- Learn about [Hydrogen's architecture and framework](/custom-storefronts/hydrogen/framework).
- Learn about [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components), an opinionated data-fetching and rendering workflow for React apps.
