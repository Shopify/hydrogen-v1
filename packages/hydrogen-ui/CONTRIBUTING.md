## Writing tests

- Tests should live next to the component
- Tests should end with \*.test.ts(x) (NOT .spec.tsx(x))
- Tests should be wrapped with an outer describe('<ComponentName />')
- Use react-testing-library to test React components
- Use factories (faker) instead of hardcoded fixtures
- Tests should use `it` for the test block, and the text should read like a sentence

## Package exports notes:

- Until Typescript can resolve package.exports, we include package.typesVersions to help alias the package.exports shortened filenames to the `.d.ts` files.

- Until ESLint can resolve package.exports, we added hydrogen-ui to `.eslintrc.js`->`node/no-missing-import.allowModules`
