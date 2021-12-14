<aside class="note beta">
<h4>Developer preview</h4>

<p>This is a developer preview of Hydrogen. The documentation will be updated as Shopify introduces <a href="https://github.com/Shopify/hydrogen/releases">new features and refines existing functionality</a>. Production launches of Hydrogen custom storefronts aren't yet supported as Shopify is evolving the Hydrogen framework.</p>

</aside>

Hydrogen contains a set of Shopify-specific commerce hooks that help accelerate your development process. This guide provides a complete reference of Hydrogen hooks.

## Primitive hooks

Primitive hooks are the building blocks for different component types, including products, variants, and cart.

The [`useMoney`](/api/hydrogen/hooks/primitive/usemoney) hook takes a [`MoneyV2` object](/api/storefront/reference/common-objects/moneyv2) and returns a default-formatted string of the amount with the correct currency indicator, along with some of the parts provided by [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat).

## Global hooks

Hydrogen provides the following global hooks that you can use to fetch data from server components:

<table>
  <tr>
    <th>Hook name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/global/usequery">useQuery</a></td>
    <td>A wrapper around <code>useQuery</code> from <code>react-query</code>. It supports Suspense calls on the server and on the client.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/global/useserverstate">useServerState</a></td>
    <td>Manage a server state when using Hydrogen as a React Server Component framework.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/global/useshop">useShop</a></td>
    <td>Access values within <code>shopify.config.js</code>.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/global/useshopquery">useShopQuery</a></td>
    <td>Make server-only GraphQL queries to the <a href="/api/storefront">Storefront API</a>.</td>
  </tr>
</table>

## Product and variant hooks

Products are the goods, digital downloads, services, and gift cards that a merchant sells. If a product has options, like size or color, then merchants can add a variant for each combination of options.

Each combination of option values for a product can be a variant for that product. For example, a t-shirt might be available for purchase in blue and green. The blue t-shirt and the green t-shirt are variants.

Hydrogen includes the following product and variant hooks:

<table>
  <tr>
    <th>Hook name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/product-variant/useproduct">useProduct</a></td>
    <td>Returns the product object of the nearest <code>ProductProvider</code>.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/product-variant/useproductoptions">useProductOptions</a></td>
    <td>Returns an object that enables you to keep track of the selected variant and/or selling plan state, as well as callbacks for modifying the state.</td>
  </tr>
</table>

## Cart hooks

A cart contains the merchandise that a customer intends to purchase and the estimated cost associated with the cart. When a customer is ready to purchase their items, they can proceed to checkout.

Hydrogen includes the following cart hooks:

<table>
  <tr>
    <th>Hook name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/cart/usecart">useCart</a></td>
    <td>Provides access to the Storefront API's <a href="/api/storefront/reference/cart/cart">Cart object</a>.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/cart/usecartattributesupdatecallback">useCartAttributesUpdateCallback</a></td>
    <td>Returns a callback that can be used to update the cart's attributes.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/cart/usecartbuyeridentityupdatecallback">useCartBuyerIdentityUpdateCallback</a></td>
    <td>Returns a callback that can be used to update the cart's buyer identity.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/cart/usecartcheckouturl">useCartCheckoutUrl</a></td>
    <td>Returns a string of the checkout URL for the cart.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/cart/usecartcreatecallback">useCartCreateCallback</a></td>
    <td>Returns a callback that can be used to create a cart.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/cart/usecartdiscountcodesupdatecallback">useCartDiscountCodesUpdateCallback</a></td>
    <td>Returns a callback that can be used to update the cart's discount codes.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/cart/usecartline">useCartLine</a></td>
    <td>Provides access to the Storefront API's <a href="/api/storefront/reference/cart/cartline">CartLine object</a>.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/cart/usecartlinesaddcallback">useCartLinesAddCallback</a></td>
    <td>Returns a callback that can be used to add lines to a cart. If a cart doesn't already exist, then it will create the cart for you.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/cart/usecartlinesremovecallback">useCartLinesRemoveCallback</a></td>
    <td>Returns a callback that can be used to remove lines from a cart.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/cart/usecartlinestotalquantity">useCartLinesTotalQuantity</a></td>
    <td>Returns the total amount of items in the cart.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/cart/usecartlinesupdatecallback">useCartLinesUpdateCallback</a></td>
    <td>Returns a callback that can be used to update lines in a cart.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/cart/usecartnoteupdatecallback">useCartNoteUpdateCallback</a></td>
    <td>Returns a callback that can be used to update the cart's note.</td>
  </tr>
</table>

## Localization hooks

Localization can help merchants expand their business to a global audience by creating shopping experiences in local languages and currencies.

Hydrogen includes the following localization hooks:

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

## Metafield hooks

Metafields allow you to attach specialized information to Shopify resources, such as part numbers or release dates. Merchants and other apps can retrieve and edit the data that's stored in metafields from the Shopify admin.

Hydrogen includes the following metafield hooks:

<table>
  <tr>
    <th>Hook name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/metafield/useparsedmetafields">useParsedMetafields</a></td>
    <td>Returns an array of parsed metafields.</td>
  </tr>
</table>

## Next steps

- [Get started](/custom-storefronts/hydrogen/getting-started/create) with Hydrogen and begin building a custom storefront.
- Learn about [Hydrogen's architecture and framework](/custom-storefronts/hydrogen/framework).
- Learn about [React Server Components](/custom-storefronts/hydrogen/framework/react-server-components), an opinionated data-fetching and rendering workflow for React apps.
