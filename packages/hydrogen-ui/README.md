# Hydrogen-UI

## Implementation Notes

### jsx-runtime

If you're using Vite and not using our plugin, and there is an error that says something like `Uncaught ReferenceError: module is not defined`, it's likely because of an issue with [Vite and react/jsx-runtime](https://github.com/vitejs/vite/issues/6215).

The solution is to add `'react/jsx-runtime'` to your Vite config's `optimizeDeps.include` array.

### Jest

Until [Jest can correctly resolve package.exports](https://github.com/facebook/jest/issues/9771), here's a workaround:

- Add the [`enhanced-resolve`](https://www.npmjs.com/package/enhanced-resolve) npm package
- Add a new file and copy the code found in the `_export_map_resolver.js` file [here](https://github.com/ceramicnetwork/js-dag-jose/commit/51750b4266bc57ae56af05e0899acf38c519799b#diff-3f698d0dc0e17487612dbe228105aa820683a2eb38343929c1c45d9a8aa479f8)
- Add the `resolver` field to your Jest config, and point it to that file you just created. [Here's](https://github.com/ceramicnetwork/js-dag-jose/commit/51750b4266bc57ae56af05e0899acf38c519799b#diff-7ae45ad102eab3b6d7e7896acd08c427a9b25b346470d7bc6507b6481575d519R55) an example
