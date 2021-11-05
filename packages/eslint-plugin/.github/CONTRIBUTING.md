# Contributing to `eslint-plugin-hydrogen`

## Thanks for your interest in being a contributor ❤️

If this is your first time contributing to an Open Source Project on GitHub, you can learn how from [this free course](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github).
All changes should have tests and documentation.

## Project setup

1. Fork and clone the repo
2. `$ yarn install` to install dependencies
3. `$ yarn test` to run all tests

## Test changes in the starter template

Before submitting a PR you can test your changes in the starter template by replacing the contents of `packages/dev/.eslintrc.js` with:

```js
module.exports = {
  extends: ['plugin:hydrogen/recommended'],
};
```

And then modifying the `lint:js` task in `packages/dev/package.json` to be:

```json
    "lint:js": "eslint --rulesdir '../eslint-plugin/dist/' --no-error-on-unmatched-pattern --ext .js,.ts,.jsx,.tsx src",
```

Finally, run `yarn lint:js` from the root of that package.
