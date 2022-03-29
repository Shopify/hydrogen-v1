## Configurations

The ESLint configurations available in Hydrogen are bundled in the ESLint plugin. To use configurations, you need to extend the relevant configuration in your project’s `.eslintrc.js` configuration file. The ESLint plugin exports a [recommended](#recommended-configuration) and a [Hydrogen](#hydrogen-configuration) configuration.

### Recommended configuration

The recommended configuration enforces Shopify's JavaScript best practices and includes third-party plugins and configurations.

To enable the recommended configuration, add the `extends` property in your `.eslintrc.js` config file:

{% codeblock file, filename: '.eslintrc.js' %}

```js
{
  extends: 'plugin:hydrogen/recommended',
}
```

{% endcodeblock %}

### Hydrogen configuration

Unlike the recommended configuration, the Hydrogen configuration excludes suggested third-party plugins and configurations. It enables only the [Hydrogen rules](https://github.com/Shopify/hydrogen/tree/main/packages/eslint-plugin/src/rules) with their suggested defaults.

To enable the Hydrogen configuration, add the `extends` property in your `.eslintrc.js` config file:

{% codeblock file, filename: '.eslintrc.js' %}

```js
{
  extends: 'plugin:hydrogen/hydrogen',
}
```

{% endcodeblock %}
