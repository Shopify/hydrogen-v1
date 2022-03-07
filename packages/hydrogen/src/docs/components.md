<aside class="note beta">
<h4>Developer preview</h4>

<p>This is a developer preview of Hydrogen. The documentation will be updated as Shopify introduces <a href="https://github.com/Shopify/hydrogen/releases">new features and refines existing functionality</a>.</p>

</aside>

Hydrogen components are objects that contain all of business logic for the commerce concept that they represent. They're used to parse and process data.

## Primitive components

Primitive components are the building blocks for different component types, including products, variants, and cart.

<table>
  <tr>
    <th>Component name</th>
    <th>Component type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/primitive/externalvideo">ExternalVideo</a></td>
    <td>Shared</td>
    <td>Renders an embedded video for the Storefront API's <a href="/api/storefront/reference/products/externalvideo">  ExternalVideo object</a>.</td>
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

Global components wrap your entire app. Hydrogen includes the [ShopifyProvider](/api/hydrogen/components/global/shopifyprovider) component.

## Product and variant components

Product and variant components relate to the goods, digital downloads, services, and gift cards that a merchant sells. If a product has options, like size or color, then merchants can add a variant for each combination of options.

<table>
  <tr>
    <th>Component name</th>
    <th>Component type</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/product-variant/productdescription">ProductDescription</a></td>
    <td>Client</td>
    <td>Renders a <code>RawHtml</code> component with the product's <a href="/api/storefront/reference/products/product">descriptionHtml</a>.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/product-variant/productmetafield">ProductMetafield</a></td>
    <td>Client</td>
    <td>Renders a <code>Metafield</code> component with a product <a href="/api/storefront/reference/common-objects/metafield">metafield</a>.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/product-variant/productprice">ProductPrice</a></td>
    <td>Client</td>
    <td>Renders a <code>Money</code> component with the product <a href="/api/storefront/reference/products/product">priceRange</a>'s <code>maxVariantPrice</code> or <code>minVariantPrice</code>, or the product <a href="/api/storefront/reference/products/product">compareAtPriceRange</a>'s <code>maxVariantPrice</code> or <code>minVariantPrice</code>.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/product-variant/productprovider">ProductProvider</a></td>
    <td>Client</td>
    <td>Sets up a context with product details.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/product-variant/producttitle">ProductTitle</a></td>
    <td>Client</td>
    <td>Renders a <code>span</code> element with the product's title.</td>
  </tr>
</table>

## Cart components

Cart components relate to the merchandise that a customer intends to purchase.

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
    <td><a href="/api/hydrogen/components/cart/cartlineimage">CartLineImage</a></td>
    <td>Client</td>
    <td>Renders an <code>Image</code> component for the cart line merchandise's image.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartlineprice">CartLinePrice</a></td>
    <td>Client</td>
    <td>Renders a <code>Money</code> component for the cart line merchandise's price or compare at price.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartlineproducttitle">CartLineProductTitle</a></td>
    <td>Client</td>
    <td>Renders a <code>span</code> element (or the type of HTML element specified by the <code>as</code> prop) with the cart line merchandise's title.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartlineprovider">CartLineProvider</a></td>
    <td>Client</td>
    <td>Creates a context for using a cart line.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartlinequantity">CartLineQuantity</a></td>
    <td>Client</td>
    <td>Renders a <code>span</code> element (or the type of HTML element specified by the as prop) with the cart line's quantity.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartlinequantityadjustbutton">CartLineQuantityAdjustButton</a></td>
    <td>Shared</td>
    <td>Renders a button that adjusts the cart line's quantity when pressed.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/components/cart/cartlines">CartLines</a></td>
    <td>Shared</td>
    <td>Iterates over each cart line and renders its children within a <code>CartLineProvider</code> for each cart line.</td>
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

Localization components relate to creating shopping experiences for a global audience in local languages and currencies. Hydrogen includes the [LocalizationProvider](/api/hydrogen/components/localization/localizationprovider) component.

## Customizing Hydrogen components

You can customize Hydrogen components using passthrough and render props.

- **Passthrough props**: You can pass attributes as props to the Hydrogen component, and the Hydrogen component will pass them through to the rendered HTML tag.
- **Render props**: You can pass a function that returns JSX as a child to the Hydrogen component.

### `Image` component example

The [`Image`](/api/hydrogen/components/primitive/image) component by default takes a single prop, `image`, which corresponds to the [Storefront API `Image` object](/api/storefront/reference/common-objects/image). It outputs an image tag with the `src` and `alt` attributes taken from the image `url` and image `altText`:

{% codeblock file, filename: "Image tag example" %}

```js
// Input image prop
<Image image={image} />

// Output default image tag
<img
  src={image.url}
  alt={image.altText}
/>
```

{% endcodeblock %}

Any attributes supported by the component's outputted HTML tag are supported, except for those explicitly controlled by the component. For example, the `src` attribute for the [`Image`](/api/hydrogen/components/primitive/image) component and the `dangerouslySetInnerHtml` attribute for the [`RawHtml`](/api/hydrogen/components/primitive/rawhtml) component are explicitly controlled by the component.

If you wanted to include a class name and an `onClick` function, then you could use the `className` and `onClick` props:

{% codeblock file, filename: "Customized image tag example" %}

```js
// Input `className` and `onClick` image props
<Image
  image = {image}
  className="border-black"
  onClick={myFunction}
/>

// Output customized image tag
<img
  src={image.originalSrc}
  alt={image.altText}
  className="border-black"
  onClick={myFunction}
/>
```

{% endcodeblock %}

### `RawHtml` component example

You might want to customize the HTML tag that is outputted. For example, the [`RawHtml`](/api/hydrogen/components/primitive/rawhtml) component takes a string of HTML and renders a `div` by default with its inner HTML set.

If you wanted to render the `div` as a `section` instead, then you could pass the HTML tag `section` through as the `as` prop:

{% codeblock file, filename: "Customized HTML tag example" %}

```js
// Input RawHtml props
<RawHtml
  dangerouslySetInnerHTMLString={myHtml}
  as="section"
  className="text-center"
/>

// Output customized HTML tag
<section
  dangerouslySetInnerHtml={myHtml}
  className="text-center"
></section>
```

{% endcodeblock %}
