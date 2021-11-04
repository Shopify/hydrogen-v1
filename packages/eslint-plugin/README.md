# `eslint-plugin-hydrogen`

Hydrogen provides an ESLint plugin to enforce Shopify’s javascript best practices and catch common issues when using React Server components in Hydrogen apps.

| Rule                                                                                | Description                                                                   | Configurations | Fixable |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | -------------- | ------- |
| [hydrogen/no-state-in-server-components](./src/rules/no-state-in-server-components) | Prevents `useState` and `useReducer` in React Server Components               | `recommended`  |         |
| [hydrogen/prefer-image-component](./src/rules/prefer-image-component)               | Prefer using @shopify/hydrogen `Image` component in place of HTML `img` tags' | `recommended`  | ✅      |

## Installation

You'll first need to install [ESLint](http://eslint.org) in addition to this module.

```bash
yarn add --dev eslint eslint-plugin-hydrogen
```

## Usage

Hydrogen’s ESLint configurations come bundled in this package. In order to use them, you simply extend the relevant configuration in your project’s `.eslintrc.js`.

### Configurations

#### Recommended

This plugin exports a recommended configuration.

To enable this configuration use the `extends` property in your `.eslintrc.js`
config file:

```ts
{
  extends: 'plugin:hydrogen/recommended',
}
```

#### Recommended for Typescript projects

This plugin exports a recommended configuration for Typescript projects.

To enable this configuration use the `extends` property in your `.eslintrc.js`
config file:

```ts
{
  extends: 'plugin:hydrogen/recommended-typescript',
}
```
