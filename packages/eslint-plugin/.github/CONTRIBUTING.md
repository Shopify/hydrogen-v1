# Contributing to `eslint-plugin-hydrogen`

## Thanks for your interest in being a contributor ❤️

If this is your first time contributing to an Open Source Project on GitHub, you can learn how from [this free course](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github).
All changes should have tests and documentation.

## Project setup

1. Fork and clone the repo
2. `$ yarn install` to install dependencies
3. `$ yarn test` to run all tests

## Test changes in the Demo Store template

Before submitting a PR please test your changes in one of the hydrogen templates in the top-level `/templates` folder in this repo.

To do this you must first run `yarn link` from within the `packages/eslint-plugin` folder.

Then make sure the ESLint configuration (`.eslintrc.js`) inside the template is extending from this plugin. For example, to test in the `demo-store`, the `/templates/demo-store/.eslintrc.js` should look something like this:

```js
// example: /examples/demo-store/.eslintrc.js`

module.exports = {
  extends: ['plugin:hydrogen/recommended'],
};
```

Then run `yarn link eslint-plugin-hydrogen` and `yarn lint:js` from within the Demo Store template (example: `/templates/demo-store`).

## Resources

- [Naming conventions](https://eslint.org/docs/developer-guide/working-with-rules#rule-naming-conventions)
