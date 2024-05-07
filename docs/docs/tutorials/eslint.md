# ESLint


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



Hydrogen provides an [ESLint plugin](https://github.com/Shopify/hydrogen/tree/main/packages/eslint-plugin) that enforces Shopify’s JavaScript best practices and catches common issues when using React Server Components in Hydrogen apps. This guide provides information about installing and configuring the ESLint plugin.

## Installation

Run the following command to install [ESLint](https://eslint.org/) and the ESLint plugin:

```bash

yarn add --dev eslint eslint-plugin-hydrogen
```



### Using Shopify CLI

You can automatically set up `eslint` using Shopify CLI by running the following command within your Hydrogen app:

```bash

yarn shopify hydrogen add eslint
```



## Configurations

The ESLint configurations available in Hydrogen are bundled in the ESLint plugin. To use configurations, you need to extend the relevant configuration in your project’s `.eslintrc.js` configuration file. The ESLint plugin exports a [recommended](#recommended-configuration) and a [Hydrogen](#hydrogen-configuration) configuration.

### Recommended configuration

The recommended configuration enforces Shopify's JavaScript best practices and includes third-party plugins and configurations.

To enable the recommended configuration, add the `extends` property in your `.eslintrc.js` config file:

```js
// .eslintrc.js

{
  extends: 'plugin:hydrogen/recommended',
}
```



### Hydrogen configuration

Unlike the recommended configuration, the Hydrogen configuration excludes suggested third-party plugins and configurations. It enables only the [Hydrogen rules](https://github.com/Shopify/hydrogen/tree/main/packages/eslint-plugin/src/rules) with their suggested defaults.

To enable the Hydrogen configuration, add the `extends` property in your `.eslintrc.js` config file:

```js
// .eslintrc.js

{
  extends: 'plugin:hydrogen/hydrogen',
}
```



### TypeScript configuration

The ESlint plugin provides a configuration override that you can use in TypeScript projects. You can add the following configuration after either the recommended or Hydrogen configuration:

```js
// .eslintrc.js

{
  extends: ['plugin:hydrogen/recommended', 'plugin:hydrogen/typescript'],
}
```



## Contributing to Hydrogen's ESLint plugin

Hydrogen's ESLint plugin is open source. Learn how to [contribute to the project on GitHub](https://github.com/Shopify/hydrogen/blob/main/packages/eslint-plugin/.github/CONTRIBUTING/).

## Next steps

- Explore the [ESLint plugin](https://github.com/Shopify/hydrogen/tree/main/packages/eslint-plugin).
