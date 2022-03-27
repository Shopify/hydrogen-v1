<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/cli and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/reference-docs/hydrogen.md. -->

## `@shopify/hydrogen-cli`

The `hydrogen/cli` package provides interactive project scaffolding for Hydrogen apps and other useful commands to help you build on `@shopify/hydrogen`.

> Note:
> The CLI doesn't currently generate the [Demo Store template](/custom-storefronts/hydrogen/getting-started). Run `npx create-hydrogen-app` to scaffold a new project with the Demo Store template. To contribute to the Demo Store template, update the [template files](https://github.com/Shopify/hydrogen/tree/main/examples/template-hydrogen-default).

## Installation

The `@shopify/hydrogen-cli` package can be installed globally or as a project dependency:

```bash
yarn global add @shopify/hydrogen-cli
```

After installing the package, you'll have access to the `h2` binary in your command line. You can verify that it's properly installed by running the following command, which presents you with the currently installed version:

```bash
h2 version
```

### Upgrading

To upgrade the global `@shopify/hydrogen-cli` package, run the following command:

```bash
yarn global upgrade --latest @shopify/hydrogen-cli
```
