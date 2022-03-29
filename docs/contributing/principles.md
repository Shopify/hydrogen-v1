---
title: 'Principles & Assumptions'
sidebar_position: 2
---

For years, Shopify merchants and developers have been building "headless" web storefront solutions in the cracks and margins of our platform. The people who are at the core of our business have been left to fend for themselves, bombarded by dozens of choices for JavaScript frameworks, style libraries, component frameworks, and data-fetching solutions.

Opinionated design is core to Shopify and its success, and we believe we can pave the way to a new standard for custom storefronts across the industry.

That's why we're introducing **Hydrogen** to the world.

## Headless, the Good Parts

In the same way that Liquid storefronts are "Web Native Online Store, the Good Parts," Hydrogen provides an opinionated way to build custom storefronts.

Hydrogen's design is inspired by the [Ruby on Rails Doctrine](https://rubyonrails.org/doctrine/). If you're a developer building Hydrogen, you should read this doctrine to understand the underlying principles behind Hydrogen.

- Hydrogen optimizes for **programmer happiness** by rethinking the way web applications are built.
- Hydrogen provides **sharp knives** by allowing developers to write custom GraphQL queries without much hand-holding or abstracted safety nets.
- Hydrogen pushes **progressively forward**, setting the stage for when new server-side rendering patterns like React Server Components are introduced.
- Hydrogen provides the **best dishes on the menu**: React for components, React Hooks for managing state, headless and stylable commerce components for managing complex interactions, and Tailwind for styles.

Taking this approach to build Hydrogen might run counter to the way the JavaScript ecosystem works today. For example, a platform like Shopify might advocate for plugins in every single popular framework and integration out there to attempt to supplement the endlessly-growing list of choices.

**Shopify wants to part with this tradition**. Hydrogen is an opinionated product allowing Shopify merchants to build custom web storefronts. It doesn't aim to seamlessly integrate with the way other frameworks do things; rather, it provides a powerful SDK which allows developers to take the goodness of Hydrogen wherever they want to go. Hydrogen is a toolkit: developers can use the whole thing, or they can use the parts to snap into other things they want to use.

## Assumptions

- **Merchants with existing headless (React) web solutions can use Hydrogen components when they are released**. The unstyled components built for Shopify storefronts can replace custom-built components.
- **Merchants with existing headless (React) web solutions will NOT use the Demo Store template**, unless they feel like rebuilding their app.
- **Hydrogen components are built with React**, but we may support other frameworks like Vue in the future.
- **Hydrogen's Demo Store template is built using React**, and we have NO plans to build a similar template for other frameworks like Vue.
- **Hydrogen will not offer a vanilla JavaScript SDK solution**. Hydrogen is built for React and will eventually offer components for other frameworks. Users building their web app without a supported framework will make GraphQL calls directly using modern web libraries like `fetch`.
