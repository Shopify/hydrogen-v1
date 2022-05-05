# Hydrogen templates

Hydrogen templates are complete working implementations of Shopify custom storefronts. You can automatically scaffold these storefronts with Shopify CLI.

## Demo store

```sh
## Create a Hydrogen app with the default Demo store template
## Use `--template demo-store` to set the template explicitly
# yarn
$ yarn create hydrogen-app
# npm
$ npm init hydrogen-app@latest
# npx
$ npx create-hydrogen-app
```

**Demo Store** is the default template installed when creating a new Hydrogen storefront. It’s a complete Hydrogen storefront that uses live production data provided by Shopify. It includes demonstration implementations of a homepage, product detail pages, collections, data-fetching, caching strategies, Tailwind integration, and more. It showcases Shopify’s opinionated best practices for building storefronts with Hydrogen, and some advanced features of the framework. Pick this template to inspect a working Hydrogen codebase, or to use as a starting point for your own build.

## Hello World

```sh
## Create a Hydrogen app with the Hello World template
# yarn
$ yarn create hydrogen-app --template hello-world
# npm
$ npm init hydrogen-app@latest --template hello-world
# npx
$ npx create-hydrogen-app --template hello-world
```

**Hello World** is a minimal implementation of a Hydrogen app. It has few dependencies and very little boilerplate. Pick this template to start building from scratch.
