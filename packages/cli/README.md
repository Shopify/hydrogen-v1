<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/cli and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

## `@shopify/hydrogen-cli`

`hydrogen/cli` provides interactive project scaffolding for hydrogen apps and other useful commands to help developers build on `@shopify/hydrogen`.

Note: The CLI does not currently provide a full starter template. Run npx create-hydrogen-app instead to scaffold a new project with the starter template. To contribute to the starter template, update files in examples/template-hydrogen-default.

## Installation

The `@shopify/hydrogen-cli` is installable globally or as a project dependency.

```bash
yarn global add @shopify/hydrogen-cli
```

After installation, you will have access to the `h2` binary in your command line. You can verify that it is properly installed by running `h2 version`, which should present you with the currently installed version.

```bash
h2 version
```

### Upgrading

To upgrade the global `@shopify/hydrogen-cli` package, you need to run:

```bash
yarn global upgrade --latest @shopify/hydrogen-cli
```
