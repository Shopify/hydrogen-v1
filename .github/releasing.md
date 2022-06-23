# Releasing

Hydrogen versions are determined exclusively by [changesets](https://github.com/changesets/changesets). When new changesets are merged into a release branch like `v1.x-2022-07`, a new PR will be automatically created containing the proposed version.

This PR can stay open and will be continously updated by the changesets bot until you are ready to release a new version.

## Releasing new versions

When you are ready to release a new version of Hydrogen, merge the PR created by the changesets bot. This will convert all changesets into appropriate `CHANGELOG` files, add Git tags, create GitHub releases for each package contained in the release, and publish them to NPM.

Then, the action will automatically compile the TypeScript templates to JavaScript and push these changes to the `dist` branch of the repo. The Shopify CLI will read the templates from this branch when running `yarn create @shopify/hydrogen`.

## Releasing unstable versions

Hydrogen maintains an `unstable` branch as a home for features and breaking changes related to the `unstable` version of the Storefront API.

To release an unstable version:

1. Merge your changes into the `unstable` branch.
1. Visit the [Changesets Snapshot](https://github.com/Shopify/hydrogen/actions/workflows/changesets_snapshot.yml) GitHub Action workflow.
1. Click "Run Workflow." Be sure to select `unstable` as the branch name.

A new snapshot release will be created with your changes and tagged on NPM with `unstable`. You can install the unstable version of Hydrogen using this tag:

```bash
yarn add @shopify/hydrogen@unstable
```

## Releasing experimental or snapshot versions

Sometimes, you might want to publish the latest version of the main branch as an NPM release to test in standalone apps. Or you want to test a new, unmerged feature in an NPM release.

To do so, you can merge your code into a new branch and give it a name, like `experimental`. Feel free to "recycle" the existing branch (delete it or force-push your code). You can also create a branch of your own if you working on a long-lived feature that will likely include many snapshot releases. Since NPM releases are permanent, existing developers working on a previously-released experimental version will be bound to the timestamped release number.

However, be mindful that any new "tags" we create will show up at the top of npmjs.org under the Hydrogen versions tab, so consider re-using the existing `experimental` branch when possible.

> Note:
> The `experimental` branch, and other snapshot release branches, should be treated as ephemeral, and you should NOT develop your features directly in the branch. Instead, use a separate feature branch and merge it into that branch to perform releases.

To release an snapshot version:

1. Merge your changes into the `experimental` branch (or your custom snapshot branch).
1. Visit the [Changesets Snapshot](https://github.com/Shopify/hydrogen/actions/workflows/changesets_snapshot.yml) GitHub Action workflow.
1. Click "Run Workflow." Be sure to select the same branch name from step 1.

A new snapshot release will be created with your changes and tagged on NPM with `experimental` or your branch name. You can install this version of Hydrogen using that tag:

```bash
yarn add @shopify/hydrogen@experimental
```

## Common problems

**After merging the auto-generated changeset PR, my GitHub Action encountered an Error with the message `No commits between X and changeset-release/Y`**

This happens when changesets does not properly clear out all the changesets in the `.changesets` directory of the hydrogen repo. The soluction is to create a new PR with all of the `.changesets` removed. The GitHub Action will re-run when you merge the second PR.

## Things to consider and improve upon

- Oxygen reads the hydrogen `demo-store` template from the `create-hydrogen-app` package in this repo. Until the Oxygen teams updates their workflow, we need to continue to publish this package whenever the `demo-store` template changes.
