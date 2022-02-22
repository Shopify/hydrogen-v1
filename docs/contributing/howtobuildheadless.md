# How to build headless components

> ⚠️ Ensure you've read [What are headless components?](./headlesscomponents.md) before attempting to build any components yourself.

## Understand the concept and primitives

Consider what commerce concepts and/or data objects you’ll be working with for the component, how they are represented in the [Shopify Storefront API](https://shopify.dev/api/storefront), which data is essential for them, and which resources use them.

For example, if you want to build a component to handle [prices and money](https://shopify.dev/api/storefront/reference/common-objects/moneyv2), it’s important to know the amount and the currency code. It’s also important to know that there are prices associated with [ProductVariants](https://shopify.dev/api/storefront/reference/products/productvariant#fields-2021-07), and [price ranges](https://shopify.dev/api/storefront/reference/products/productpricerange) for [Products](https://shopify.dev/api/storefront/reference/products/product). This helps you determine which essential data or props are needed (for example, `amount` and `currencyCode`), how many components need to be built, and at which level of abstraction they need to be built (for example, a base `Money` component, or a `ProductPrice` component that makes use of the `Money` component).

## Determine sensible defaults

Consider what a sensible default would be for the component. Look at various ecommerce websites and check if there is a common pattern for how this information is rendered, both on Shopify and non-Shopify storefronts. Browse through the [Liquid documentation](https://shopify.dev/api/liquid) to see if there are any [Liquid filters](https://shopify.dev/api/liquid/filters) available. If there are filters available, see what those render by default and what customizations they support. Lastly, chat with UX folks to see what the best default should be.

## Prioritize developer experience

Hydrogen must be fun and easy to use, with good ergonomics. Developer experience is very important.

Always consider how _you_ would want to use this component if you were a developer building a custom storefront. Is the API easy to use? Which props can I pass? What are their names? Should I need to pass these props by default, or can I make use of a context to make the component easier to use? What if I don’t want to use the default? How can I customize it? Is this easy to use with JSX?

Developers should be **delighted** when they use headless components. To quote Tobi Lütke: “Delight works by taking your experience minus your expectation, and if the end result is a positive number, you are delighted by that margin.”

## Code, code, code

Start building. It’s likely that you might discover while hacking away that you don’t need a component at all: you might only need a hook (for example, `useProductOptions`) or some utilities (`flattenConnection`). On the other hand, you might discover that you need more components than you initially anticipated.
