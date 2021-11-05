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
