# Using Vite for Hydrogen

## Status

Approved by internal consensus in early 2021.

## tl;dr

We will use Vite as the Hydrogen development server and bundler. It Vite v2 added multi-framework support, including a beta version of SSR. Vite's plugin API is extremely powerful yet approachable.

## Context

Tobi chose Vite during an early exploration building a custom storefront. This technology choice stuck, and it's been a really good fit for Hydrogen.

Vite follows a "bundle-less" approach, taking advantage of modern browser technology and its ability to load raw JavaScript modules using script tags. Vite tweaks this model a bit by optimizing these modules up front in a way that avoids the penalty incurred by "request waterfalls" (many chained imports loading one another).

Vite's plugin system is inspired by WMR and is modeled after Rollup.js.

Hydrogen uses Vite plugins to power SSR, RSC, virtual entrypoints, and more.

Read more about building Hydrogen with Vite: https://shopify.engineering/developer-experience-with-hydrogen-and-vite

## Consequences

Vite's SSR support is marked as "beta" during v2. This has led to a few bugs and inconsistencies related to module resolution. The ever-present battle to deprecate CJS and migrate to ESM in the Node.js ecosystem has made things more difficult.

When we first adopted Vite in April 2021, it was considered a pretty wild choice to not use Webpack. However, many other frameworks have followed suit, like SvelteKit, to adopt Vite as their primary bundler tool.

Shopify already has a lot of tooling around Webpack, so we gave up on a lot of potential re-use by making the switch to Vite. It's possible this slowed our development velocity a bit.

Third-party NPM packages also tend to be hit-or-miss when combined with Vite's module optimization engine. This is handled on a case-by-case basis and seems to be improving.
