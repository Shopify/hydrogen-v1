# Contributing to Hydrogen

**Requirements:**

- Node.js version 16.5.0 or higher
- Yarn

```bash
git clone git@github.com:Shopify/hydrogen.git
yarn

# Start the library dev server first
yarn dev-lib

# In a new tab, start the dev server
yarn dev-server
```

Visit the dev environment at http://localhost:3000.

To make changes to the starter template, edit the files in `examples/template-hydrogen-default`.

To modify Hydrogen framework, components, and hooks, edit the files in `packages/hydrogen`.

You can [inspect Vite plugin](https://github.com/antfu/vite-plugin-inspect) transformations by visiting `http://localhost:3000/__inspect`.

## Context

Hydrogen is a Yarn v1 monorepo. It consists of several key packages:

- `examples/template-hydrogen-default`: The starter template
- `packages/hydrogen`: The Hydrogen React framework & SDK
- `packages/create-hydrogen-app`: The CLI used to scaffold new projects
- `packages/cli`: The CLI used to perform tasks in a Hydrogen app
- `packages/playground`: Test cases used for both manual testing and automated end-to-end tests

For more information, check out the following resources:

- [Decision Log](./contributing/decisions.md)
- [Principles & Assumptions](./contributing/principles.md)

## Formatting and Linting

Hydrogen uses ESLint for linting and Prettier for code formatting.

[Yorkie](https://github.com/yyx990803/yorkie) is used to install a Git precommit hook, which lints and formats staged commits automatically.

To manually lint and format:

```bash
yarn lint
yarn format
```

## Naming conventions

Hydrogen follows common React naming conventions for filenames, component names, classes, constants, and more.

- For component **filenames** and **class names**, always use `PascalCase`.
- For **non-component filenames**, always use fully lowercase `kebab-case`.
- For **test filenames**, append `.test` before the file extension.
- When declaring **instances** of components, always use `camelCase`.
- When declaring **exported constants**, always use `SCREAMING_SNAKE_CASE`.

| &nbsp;                       | ✅ Valid                                        | 🚫 Invalid                                                                          |
| ---------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Component filenames:**     | `ProductTitle.tsx`<br>`ProductTitle.client.tsx` | `productTitle.tsx`<br>`product_title.tsx`<br>`product-title.client.tsx`             |
| **Non-component filenames:** | `client.ts`<br>`handle-event.ts`                | `Client.ts`<br>`handleEvent.ts`<br>`handle_event.ts`                                |
| **Test filenames:**          | `ExternalVideo.test.tsx`                        | `ExternalVideo-test.tsx`<br>`ExternalVideo_test.tsx`<br>`ExternalVideoTest.tsx`     |
| **Component classes:**       | `<AddToCartButton />`                           | `<addToCartButton />`                                                               |
| **Component instances:**     | `const cartSelector = <CartSelector />`         | `const CartSelector = <CartSelector />`<br>`const cart_selector = <CartSelector />` |
| **Exported constants:**      | `export const CART_COOKIE_TTL_DAYS = 14;`       | `export const CartCookieTTLDays = 14;`<br>`export const cart_cookie_ttl_days = 14;` |

## Commit Messages

Commit messages must follow the [commit message convention](../.github/commit-convention.md) so that changelogs can be more easily generated. Commit messages are automatically validated before commit (by invoking [Git Hooks](https://git-scm.com/docs/githooks) via [yorkie](https://github.com/yyx990803/yorkie)).

## Headless components

If you are building or making changes to a component, be sure to read [What are headless components?](./contributing/headlesscomponents.md) and [How to build headless components](./contributing/howtobuildheadless.md).

## GraphQL Types

If you make changes to or add any new `.graphql` files within Hydrogen, you will need to run the following commands in order to generate the type definitions and Graphql documents for the newly added/updated files:

```bash
cd packages/hydrogen
yarn graphql-types
```

## Running a local version of Hydrogen in a Hydrogen app

> Caution:
> You must use `yarn` for all commands, due to issues with NPM and dependencies, even if the prompt tells you to use `npm`.

Follow these instructions to create your own Hydrogen app using the local development version of the Hydrogen framework.

Before running any commands, be sure to build the Hydrogen lib with `yarn dev-lib` or `yarn build`.

```bash
cd packages/create-hydrogen-app && yarn link
```

This makes the executable `create-hydrogen` available globally.

Next, choose an option below.

### Option 1: `localdev` package

This option creates a new Hydrogen app similar to `examples/template-hydrogen-default` directly in the monorepo under `packages/localdev`. This directory is ignored in git, so your changes will not be tracked.

```terminal
create-hydrogen packages/localdev
# when prompted, use `localdev` for the package name
```

Then run your app:

```terminal
yarn workspace localdev dev
```

### Option 2: Standalone package

> Caution:
> This requires you to have a directory structure on your machine like `~/src/github.com/Shopify/*`, and it requires you to create your custom Hydrogen app in a namespace similar to `~/src/github.com/<namespace>/<your hydrogen app here>`.

1. In the directory you want to create your Hydrogen app, run `LOCAL=true create-hydrogen` and answer the prompts.
1. Run `cd <your app>`.
1. Run `yarn` or `npm i --legacy-peer-deps`.
1. Optional. Replace default `shopify.config.js` with your own storefront credentials.
1. Run `yarn dev` or `npm run dev` to start your dev server.
1. Open the dev server in your browser at http://localhost:3000.

If you make changes to core Hydrogen packages, then you'll need to delete `node_modules`, install dependencies again and start the server as mentioned above.

## Testing

Hydrogen is tested with unit tests for components, hooks and utilities. It is also tested with a suite of end-to-end tests inspired by [Vite's playground tests](https://github.com/vitejs/vite/tree/main/packages/playground).

Run unit tests with:

```bash
yarn test

# Optionally watch for changes
yarn test --watch
```

Run end-to-end tests with:

```bash
yarn test-e2e

# Optionally watch for changes
yarn test-e2e --watch
```

### Debugging tests in Github Actions

Tests that fail **only** in CI can be difficult and time-consuming to debug. If you find yourself in this situation, you can use [tmate](https://tmate.io/) to pause the Github Action on a given step and `ssh` into the container. Once in the container you can use `vim`, inspect the file system and try determining what might be diverging from running tests on your local computer and leading to the failure.

- Add the following `step` in your Github Actions workflow:

```yaml
- name: Setup tmate session
  uses: mxschmitt/action-tmate@v3
```

- Commit and push your changes to Github.
- The testing Github Action will run automatically and you will see it paused with both a Web Shell address and SSH address.

![tmate](./images/tmate.png)

- Copy and paste the SSH address into your terminal.

### End-to-end tests

End-to-end tests are powered by [Playwright and Chromium](https://playwright.dev/). They are modeled closely after how [Vite handles E2E tests](https://github.com/vitejs/vite/tree/main/packages/playground).

Each mini-project under `packages/playground` contains a tests folder. You are welcome to modify an existing project or add a new project if it represents a different framework scenario, e.g. using a specific CSS framework or integration.

You can run a single E2E test by passing a keyword, which is matched using regex, e.g. `yarn test-e2e server` will run the `server-components` test.

## Releasing new versions

To release a new version of Hydrogen NPM packages, Shopifolk should follow these instructions:

First, ensure all changes have been merged to `main`.

Then:

```bash
git checkout main && git pull
yarn bump-version
```

> **Important**: Until our official release, we will only release `minor` and `patch` updates. This means that breaking changes will be included in minor releases. Once we officially launch Hydrogen, we'll switch to `1.0.0` and follow a normal semantic release pattern.

When finished, push up your changes.

Next, visit the Shipit page for Hydrogen and click **Deploy**.

After Shipit has released your version, visit the [releases page on GitHub](https://github.com/Shopify/hydrogen/releases), click on the version number you just released, and select "Create release from tag." Then, select "Auto-generate release notes." At this point, edit the release notes as you see fit (e.g. call out any breaking changes or upgrade guides). Finally, click "Publish release."

## Releasing experimental versions

Releasing an experimental version of Hydrogen to GitHub can be useful if you want to test the new version in existing apps.

To release an experimental version, merge your changes into the `experimental` branch.

Then, run `yarn bump-version` locally while in the branch. Be sure to select a pre-release that contains `v.X.X-experimental.N` or enter a custom version.

After running the script, go to Shipit and find "Hydrogen Experimental." Run a deploy against the commit containing your new version, and this should release your experimental version on NPM with the `experimental` tag.

## Testing changes in another project

From the root of the repo, run:

```bash
yarn tophat ../PATH/TO/PROJECT --packages [...PACKAGES_LIST]


# example
yarn tophat ../cartogram/hydrogen-shop --packages cli hydrogen eslint-plugin

```
