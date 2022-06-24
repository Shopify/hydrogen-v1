# Using JavaScript for default storefronts and code examples instead of TypeScript

## Status

Approved by internal consensus in early 2021.

## tl;dr

We will use JavaScript instead of TypeScript as the default starter template for Hydrogen apps. We will also provide JavaScript code examples in documentation.

## Context

TypeScript is an extremely populer superset of JavaScript with type safety built in. It is used at Shopify in most JavaScript projects. It tends to be very useful for larger applications or when working with teams.

However, TypeScript can be difficult to use for newcomers. When you encounter a TypeScript error, decoding the error message can be cryptic and unforgiving. This increases as you interact with a third-party library like Hydrogen that involves generics and other non-scalar types.

At v1, we decided to write our new demo-store and hello-world templates in TypeScript and compile them to JavaScript at build time. This allowed developers who wanted to use TypeScript to use it, while still catering to developers who want to view code examples in JavaScript or build their Hydrogen apps in JavaScript.

We still use TypeScript exclusively in the Hydrogen framework and component codebase.

## Consequences

Choosing to go out with the developer preview in JavaScript caused quite a stir. Our most-upvoted GitHub Discussion featured developers expressing disappointment that TypeScript was not the default: https://github.com/Shopify/hydrogen/discussions/200

It's possible that developers choosing to use JavaScript instead of TypeScript will encounter more bugs in their code due to missing types.

It's also possible that developers are more productive using JavaScript to try out Hydrogen or build their custom storefronts, as they aren't blocked when they run into an obscure TypeScript error.
