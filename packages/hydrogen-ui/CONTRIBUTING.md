## Package exports notes:

- Until [Jest can correctly resolve package.exports](https://github.com/facebook/jest/issues/9771), here's a workaround:

  - Add the [`enhanced-resolve`](https://www.npmjs.com/package/enhanced-resolve) npm package
  - Add a new file and copy the code found in the `_export_map_resolver.js` file [here](https://github.com/ceramicnetwork/js-dag-jose/commit/51750b4266bc57ae56af05e0899acf38c519799b#diff-3f698d0dc0e17487612dbe228105aa820683a2eb38343929c1c45d9a8aa479f8)
  - Add the `resolver` field to your Jest config, and point it to that file you just created. [Here's](https://github.com/ceramicnetwork/js-dag-jose/commit/51750b4266bc57ae56af05e0899acf38c519799b#diff-7ae45ad102eab3b6d7e7896acd08c427a9b25b346470d7bc6507b6481575d519R55) an example

- Until Typescript can resolve package.exports, we include package.typesVersions to help alias the package.exports shortened filenames to the `.d.ts` files.

- Until ESLint can resolve package.exports, we added hydrogen-ui to `.eslintrc.js`->`node/no-missing-import.allowModules`
