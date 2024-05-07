# Incrementally adopt Hydrogen with route proxies


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



Some merchants want to adopt Hydrogen incrementally. For example, they might want to use the online store only for product pages and Hydrogen for everything else.

This guide explains how to adopt Hydrogen incrementally by proxying certain routes to the online store.

## Limitations

- Proxying routes is only supported on Oxygen. This is temporary.

- You can't share customer sessions.

## Sample code

The following code is an example of proxying product page requests to the online store:

```jsx
// src/routes/products/[handle].server.jsx

export async function api(request, { params }) {
  // This approach is only supported by Oxygen
  const { handle } = params;
  const response = await fetch("https://{shop}.myshopify.com/products/" + handle, {
    headers: {
      // It's important to set or forward a User-Agent, otherwise the online store might block the request
      'User-Agent': 'Hydrogen',
    },
  });
  const data = await response.text();
  return new Response(data, { headers: { "content-type": "text/html" } });
}
```



## Sharing carts

Currently, Liquid carts and Storefront API carts are separate. You can't query a Liquid cart through the Storefront API, or access a Storefront API-created cart through Liquid. We’re completing a project to address this. Soon, we'll enable you to use a cart ID from the online store to manage a Storefront API cart. Until then, you can share carts using the following steps:

### Step 1: Detect active carts

Hydrogen uses the Storefront API to manage carts. You need to update the online store theme to also use the Storefront API for carts. Liquid carts live for ten days, so switching to the Storefront API cart could result in customers losing their active carts.

To prevent this, you need to detect whether a customer is using a Liquid cart or a Storefront API cart and handle both scenarios for ten days. If a cart cookie exists, then the customer has an active Liquid cart.

The following image illustrates a cart cookie, which indicates an active Liquid cart:

{{ '/custom-storefronts/hydrogen/liquid-cart-cookie.png' | image: alt: 'Dev tools in a browser showing Cookies, with a cart cookie highlighted.' }}

### Step 2: Switch to the Storefront API for carts

Update the online store theme to use the Storefront API for carts. You'll need to run the Storefront API and Liquid carts side-by-side for ten days to avoid losing any active carts.

Hydrogen stores a Storefront API cart ID in local storage under the `shopifyCartId` key. Use the same key to manage your cart and Hydrogen will pick it up automatically when you make the switch. You must create the cart/key if it doesn’t exist, because customers might arrive on a proxied page first.

{{ '/custom-storefronts/hydrogen/hydrogen-local-storage-cart-id.png' | image: alt: 'Dev tools in a browser showing Local Storage. The Storefront API cart URL is selected, and the window displays the key `shopifycartId` and a gid.' }}

### Step 3: Proxy to the Online Store

The following code example shows how to proxy product page requests to the online store:

```jsx
// src/routes/products/[handle].server.jsx

export async function api(request, { params }) {
  // This approach is only supported by Oxygen
  const { handle } = params;
  const response = await fetch("https://{shop}.myshopify.com/products/" + handle, {
    headers: {
      // It's important to set or forward a User-Agent, otherwise the online store might block the request
      'User-Agent': 'Hydrogen',
    },
  });
  const data = await response.text();
  return new Response(data, { headers: { "content-type": "text/html" } });
}
```



Ensure that you test the implementation before directing all of your traffic to the Hydrogen site.
