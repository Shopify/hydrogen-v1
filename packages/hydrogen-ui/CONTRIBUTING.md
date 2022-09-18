## Working on Hydrogen-UI

There are two ways you can develop Hydrogen-UI components:

- Develop components in the demo store:
  1. Add `"@shopify/hydrogen-ui": "{major}.{minor}.{patch}"` to the demo-store's `package.json`
  2. Run `yarn` then `yarn dev` in the demo-store directory,
  3. Run `yarn dev:demo` in the hydrogen-ui directory
- Develop components in isolation:
  1. Run `yarn dev` (or `yarn dev:story`) in the hydrogen-ui directory to spin up an instance of [Ladle](https://ladle.dev/)
  2. Edit the component or the component's story `[ComponentName].stories.tsx`

## Authoring Components

- Exports should all be named; avoid using default exports
- The main exported component's name should match the name of the file
- Use the global variable `__HYDROGEN_DEV__` to `throw` errors in dev mode, and `console.error` in production mode
  - If using `__HYDROGEN_DEV__` in a compound `if()` statement, it must be the first check. Otherwise the `if()` statement will not be fully removed in the production bundle.

## Writing Tests

- Tests should live next to the component
- Tests should end with `*.test.ts(x)` (NOT `.spec.ts(x)`)
- Tests should be wrapped with an outer describe('<ComponentName />')
- Use react-testing-library to test React components
- Use factories (faker) instead of hardcoded fixtures
- Tests should use `it` for the test block, and the text should read like a sentence

## Writing Stories

- Stories must end with `*.stories.tsx`
- If a component's props are simple enough, then you can provide controls and only have one story
- If the props are vastly different (for example, Metafield), then create a story for each type of prop

## Test and Story Helpers

If you need a helper function that is shared between the tests and stories files, then you can create a file caled `{name}.test.helpers.ts(x)`.

- The function can't go into the test file, because when the story file imports it, it will also import Vitest and cause things to break
- The function can't go into the story file, because when you export it, it shows up as a story in the storybook/ladle navigation

## Package Exports Notes:

- Until ESLint can resolve package.exports, we added hydrogen-ui to `.eslintrc.js`->`node/no-missing-import.allowModules`
