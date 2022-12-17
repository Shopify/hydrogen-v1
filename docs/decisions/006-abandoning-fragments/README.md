# Removing fragment exports from the Hydrogen NPM package

## Status

Approved by consensus and implemented in March 2022: https://github.com/Shopify/hydrogen/issues/778

## tl;dr

We will not export massive fragments coupled to UI components from the Hydrogen NPM package. We've found that maintaining these fragments as components grow in scope became untenable, and actually led to worse performance in Hydrogen apps. We will re-evaluate the introduction of fragments on a case-by-case basis in the future.

## Context

In the early days of the Hydrogen developer preview, we exported strings containing GraphQL fragments from several UI components. Our intention was to make it easy to use the UI components by plugging in the data required to render them as fragments to the query on the server.

Over time, we added more functionality to these UI components, meaning more data was required to make them work correctly. This led to larger and more complex fragments, including the use of required variables, large default pagination values, and lots of nodes for metafields and variants.

We quickly discovered that the fragments had become bloated. With each new Hydrogen app created, developers were fetching so much unnecessary data that their pages were loading more slowly than if they had written the queries from scratch. To make matters worse, the contents of the fragments themselves were obscured away in the Hydrogen npm package, making it difficult to discover what data was being requested. To mitigate this issue, we did two things that improved the developer experience of Hydrogen.

First, we created a new **experimental logger** to detect unused properties in GraphQL queries. It alerts developers when they’re requesting data that isn’t being used in their components and encourages them to remove those fields from the pages to improve performance.

Second, we **removed almost every fragment export** from Hydrogen’s npm package. This meant more verbose queries in newly-scaffolded Hydrogen apps, but it also made the queried data more discoverable by the developers. It encouraged developers to fine-tune the queries for their needs instead of relying on fragments.

The results were enormous: some routes in the Hydrogen demo store template saw their load time **cut in half**. We’re still experimenting with these tools, as well as finding a way to introduce fragments in a smarter way to help developers new to GraphQL get onboarded more quickly.

## Consequences

Removing fragments makes the starter templates much more verbose. It's possible that it makess it more difficult for developers who are new to GraphQL to understand how to use Hydrogen.

It's less simple to fetch data than requesting a massive REST-style payload for components.

It also makes it more difficult to design React Storefront Kit components around a varying data input, as developers can completely customize queries.

We've found the performance benefits and discoverability benefits to outweigh these initial drawbacks, but there are places where fragments can be useful. For example, housed in the demo store template and reused across a single project. Or the `Media` type spreading fragment.
