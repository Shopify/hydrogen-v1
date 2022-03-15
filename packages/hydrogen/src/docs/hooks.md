<aside class="note beta">
<h4>Developer preview</h4>

<p>This is a developer preview of Hydrogen. The documentation will be updated as Shopify introduces <a href="https://github.com/Shopify/hydrogen/releases">new features and refines existing functionality</a>.</p>

</aside>

Hydrogen hooks are functions that allow you to use state and other methods inside Hydrogen components.

## Primitive hooks

Primitive hooks are the building blocks for different component types, including products, variants, and cart.

<table>
  <tr>
    <th>Hook name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/primitive/useloadscript">useLoadScript</a></td>
    <td>Loads an external script tag on the client-side.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/primitive/usemoney">useMoney</a></td>
    <td>Takes a <a href="/api/storefront/reference/common-objects/moneyv2">MoneyV2 object</a> and returns a default-formatted string of the amount with the correct currency indicator, along with some of the parts provided by <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat"><code>Intl.NumberFormat</code></a>.</td>
  </tr>
</table>

## Global hooks

Global hooks are used to fetch data from server components.

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

## Product and variant hooks

Product and variant hooks relate to the goods, digital downloads, services, and gift cards that a merchant sells. If a product has options, like size or color, then merchants can add a variant for each combination of options.

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

Cart hooks relate to the merchandise that a customer intends to purchase.

<table>
  <tr>
    <th>Hook name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/cart/usecart">useCart</a></td>
    <td>Provides access to the Storefront API's <a href="/api/storefront/reference/cart/cart">Cart object</a> and related callbacks to manipulate the cart.</td>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/cart/usecartline">useCartLine</a></td>
    <td>Provides access to the Storefront API's <a href="/api/storefront/reference/cart/cartline">CartLine object</a>.</td>
  </tr>
</table>

## Localization hooks

Localization hooks relate to creating shopping experiences for a global audience in local languages and currencies.

<table>
  <tr>
    <th>Hook name</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><a href="/api/hydrogen/hooks/localization/usecountry">useCountry</a></td>
    <td>Returns a tuple of the current localization country and a function for updating it.</td>
  </tr>
</table>

## Metafield hooks

Metafield hooks relate to attaching specialized information to Shopify resources, such as part numbers or release dates.

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
