# Removing `ProductProvider` and related components from Hydrogen

## Status

Approved by consensus and implemented in May 2022 https://github.com/Shopify/hydrogen/issues/1307

## tl;dr

We will not offer generic components like `ProductProvider` or `SelectedVariant.AddToCartButton` in Hydrogen, because we've found their data requirements to be too rigid and not actually useful to real merchant developers.

## Context

In early Hydrogen prototypes, we had a lengthy list of components, including `Product` and `SelectedVariant.AddToCartButton`. We originally thought that developers would like to wrap their product detail pages with a Product component and have access to “magical” child components like `SelectedVariant.AddToCartButton`, which reach into React context to interact with components around them.

We quickly got feedback that the components were too rigid: they expected a certain GraphQL payload so developers weren’t able to modify the query or include custom data from third-party sources. Since this is a common requirement for custom storefronts, **many of the components we built were more neat than actually useful**.

## Consequences

The removal of these components means that developers need to write more of their own bespoke code, including React context providers.

However, fewer components means less to learn and inherently less confusion.
