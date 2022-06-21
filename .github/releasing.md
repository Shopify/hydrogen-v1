# Releasing

Hydrogen versions are determined exclusively by [changesets](https://github.com/changesets/changesets). When new changesets are merged into a release branch like `v1.x-2022-07`, a new PR will be automatically created containing the proposed version.

This PR can stay open and will be continously updated by the changesets bot until you are ready to release a new version.

## Releasing new versions

When you are ready to release a new version of Hydrogen, follow these steps:

1. Merge the PR created by the changesets bot. This will convert all changesets into appropriate `CHANGELOG` files, add Git tags, and create GitHub releases for each package contained in the release.
1. Next, visit the Shipit page for Hydrogen containing the version you intend to release, e.g. `Hydrogen v1.x-2022-07`. Click **Deploy** on the merge commit that was recently created.
1. _Most recent stable version only_: After Shipit is finished publishing to NPM, manually [run the Compile templates workflow](https://github.com/Shopify/hydrogen/actions/workflows/compile_templates.yml) in GitHub against the latest stable branch. This will compile the TypeScript templates to JavaScript and push these changes to the `dist` branch of the repo. The Shopify CLI will read the templates from this branch when running `yarn create @shopify/hydrogen`. (Note: This is required, because GitHub will not allow a bot to kick off another GitHub Action, and the Changesets bot is the user who created the release.)

## Releasing unstable versions

Hydrogen maintains an `unstable` branch as a home for features and breaking changes related to the `unstable` version of the Storefront API.

To release an unstable version:

1. Merge your changes into the `unstable` branch.
1. Visit the Shipit page for `Hydrogen Unstable` and click **Deploy** on the commit you want to release

A new snapshot release will be created with your changes and tagged on NPM with `unstable`. You can install the unstable version of Hydrogen using this tag:

```bash
yarn add @shopify/hydrogen@unstable

# or start a new project:
npx @shopify/create-hydrogen@unstable
```

## Releasing experimental versions

Sometimes, you might want to publish the latest version of the main branch as an NPM release to test in standalone apps. Or you want to test a new, unmerged feature in an NPM release.

To do so, you can merge your code into the `experimental` branch. Feel free to "recycle" the existing branch (delete it or force-push your code). Since NPM releases are permanent, existing developers working on a previously-released experimental version will be bound to the timestamped release number.

> Note:
> The `experimental` branch should be treated as ephemeral, and you should NOT develop your features directly in the branch. Instead, use a separate feature branch and merge it into `experimental` to perform releases.

To release an experimental version:

1. Merge your changes into the `experimental` branch.
2. Visit the Shipit page for `Hydrogen Experimental` and click **Deploy** on the commit you want to release

A new snapshot release will be created with your changes and tagged on NPM with `experimental`. You can install the experimental version of Hydrogen using this tag:

```bash
yarn add @shopify/hydrogen@experimental

# or start a new project:
npx create-hydrogen-app@experimental
```

## Common problems

**After merging the auto-generated changeset PR, my GitHub Action encountered an Error with the message `No commits between X and changeset-release/Y`**

This happens when changesets does not properly clear out all the changesets in the `.changesets` directory of the hydrogen repo. The soluction is to create a new PR with all of the `.changesets` removed. The GitHub Action will re-run when you merge the second PR.

## Things to consider and improve upon

- Oxygen reads the hydrogen `demo-store` template from the `create-hydrogen-app` package in this repo. Until the Oxygen teams updates their workflow, we need to continue to publish this package whenever the `demo-store` template changes. 
