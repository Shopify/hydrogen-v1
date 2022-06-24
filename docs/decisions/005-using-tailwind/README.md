# Using Tailwind in our demo store

## Status

Approved by consensus in early 2021.

## tl;dr

We will use Tailwind in our demo store template and include it by default for new Hydrogen apps using this template.

## Context

Tailwind is a popular utility CSS framework that allows developers to rapidly develop custom storefronts using CSS classes. We've found that using Tailwind increases productivity after the initial learning curve. It also helps developers working together on teams to use a shared design system out of the box.

Tobi used Tailwind in his early custom storefront explorations. The Tailwind community is huge and growing rapidly. This means many developers familiar with Tailwind feel comfortable diving right into developing a new Hydrogen app.

Read: [Hydrogen & Tailwind: The Perfect Match for Building Beautiful Storefronts](https://shopify.engineering/hydrogen-tailwind-building-beautiful-storefronts).

## Consequences

Using Tailwind might have turned off some developers who prefer to write vanilla CSS, use a different CSS framework, or dislike the idea of utility CSS in general.

It is also tedious to remove Tailwind from the demo store template by hand.

However, picking Tailwind was a blessing in disguise: because Tailwind's styles are generated by importing a single CSS stylesheet, it has worked perfectly for Hydrogen apps from day one and has avoided the pains of attempting to import bespoke stylesheets into server components.