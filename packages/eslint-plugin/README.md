<!-- This file is generated from the source code. Edit the files in /packages/eslint-plugin and run 'yarn generate-docs' at the root of this repo. -->

# `eslint-plugin-hydrogen`

Hydrogen provides an ESLint plugin to enforce Shopify’s javascript best practices and catch common issues when using React Server components in Hydrogen apps.

## Configurations

### Recommended

This plugin exports a recommended configuration.

To enable this configuration use the `extends` property in your `.eslintrc.js`
config file:

```ts
{
  extends: 'plugin:hydrogen/recommended',
}
```

### Hydrogen

This plugin exports a `hydrogen` configuration. Unlike the [recommended](#recommended) configuration, this excludes suggested third-party plugins and configurations. Instead, it enables only the `hydrogen` rules with their suggested defaults.

To enable this configuration use the `extends` property in your `.eslintrc.js`
config file:

```ts
{
  extends: 'plugin:hydrogen/hydrogen',
}
```

## Contributing

If you've come here to help contribute – Thank you ❤️ Take a look at the [contributing docs](./.github/contributing.md) to get getting started.

## Installation

You'll first need to install [ESLint](http://eslint.org) in addition to this module.

```bash
yarn add --dev eslint eslint-plugin-hydrogen
```

## Usage

Hydrogen’s ESLint configurations come bundled in this package. To use them you must extend the relevant configuration in your project’s `.eslintrc.js`.
