# Releasing

Hydrogen versions are determined exclusively by [changesets](https://github.com/changesets/changesets). When new changesets are merged into a release branch like `v1.x-2022-07`, a new PR will be automatically created containing the proposed version.

This PR can stay open and will be continously updated by the changesets bot until you are ready to release a new version.

## Releasing new versions

When you are ready to release a new version of Hydrogen, follow these steps:

1. Merge the PR created by the changesets bot. This will convert all changesets into appropriate `CHANGELOG` files, add Git tags, and create GitHub releases for each package contained in the release.
1. Next, visit the Shipit page for Hydrogen containing the version you intend to release, e.g. `Hydrogen v1.x-2022-07`. Click **Deploy** on the merge commit that was recently created.
1. _Most recent stable version only_: After Shipit is finished publishing to NPM, manually [run the Stackblitz publish workflow](https://github.com/Shopify/hydrogen/actions/workflows/publish_stackblitz.yml) in GitHub against the latest stable branch. This is required, because GitHub will not allow a bot to kick off another GitHub Action, and the Changesets bot is the user who created the release.

## Releasing unstable versions

Hydrogen maintains an `unstable` branch as a home for features and breaking changes related to the `unstable` version of the Storefront API.

To release an unstable version:

1. Merge your changes into the `unstable` branch.
1. Visit the Shipit page for `Hydrogen Unstable` and click **Deploy** on the commit you want to release

A new snapshot release will be created with your changes and tagged on NPM with `unstable`. You can install the unstable version of Hydrogen using this tag:

```bash
yarn add @shopify/hydrogen@unstable

# or start a new project:
npx init @shopify/hydrogen@unstable
```

## Common problems

**After merging the auto-generated changeset PR, my GitHub Action encountered an Error with the message `No commits between X and changeset-release/Y`**

This happens when changesets does not properly clear out all the changesets in the `.changesets` directory of the hydrogen repo. The soluction is to create a new PR with all of the `.changesets` removed. The GitHub Action will re-run when you merge the second PR.
