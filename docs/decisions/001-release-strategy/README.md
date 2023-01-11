# Hydrogen Long-Term Release Strategy (NPM, GitHub)

## Status

Approved by internal consensus in early 2022.

## tl;dr

We should use a Git branch strategy driven by major-release pairs of our two main packages (`hydrogen` and `storefront-kit-react`). We should set our GitHub default branch to the latest major version branch. We should use an `unstable` branch which generates scheduled or on-demand snapshot releases.

The first branch will be `v1.x-2022-07`.

## Background

We want to keep iterating Hydrogen now that we have reached v1.0. Especially against the unstable Storefront API version. This requires us to determine a smart Git and NPM strategy which:

- Allows us to keep maintaining the existing stable version of Hydrogen packages with patches and minor improvements

- Allows us to start building the next major version of Hydrogen without jumping through a bunch of hoops

- Allows us to apply the same patches to stable and to the new major version of Hydrogen


We plan to version hydrogen and storefront-kit-react differently on NPM:

- `hydrogen` will be versioned using [semver](https://semver.org/) `(<major>.<minor>.<patch>)`

- `storefront-kit-react` will be versioned using [calver](https://calver.org/) `(<year>.<month>.<patch>)` according to its compatibility with the Storefront API of the same version

## What should we do?

We should use major version branches. At v1.0 Hydrogen launch, we'll create a new branch and set it as our default GitHub branch:

`v1.x-2022-07`

- All stable patches and minor releases will be merged into that branch

- A Changesets GitHub Action is responsible for keeping a Release PR active and handling Git tag & release via Shipit.

- Developers can install the latest stable release by running `yarn add @shopify/hydrogen @shopify/storefront-kit-react`

Meanwhile, we'll start using a new `unstable` branch to build brand new features into Hydrogen, which are tied directly to the `unstable` SFAPI.

- Unstable releases are generated using [Changeset's snapshot feature](https://github.com/atlassian/changesets/blob/main/docs/snapshot-releases.md). These can happen on-demand or even nightly, like React does.

- Because snapshot releases do not affect the changelog, changesets or package versions, commits can be safely merged between the latest major release (v1.x-2022-07) and the unstable branch.

- We will add a new redirect <https://hydrogen.new/unstable> which creates a Stackblitz based on the latest unstable release.

- Developers can install the latest unstable release by running `yarn add @shopify/hydrogen@unstable @shopify/storefront-kit-react@unstable`

Then, when it comes time to release React Storefront Kit for the next version of the stable SFAPI, we'll cut a new branch and make it the default branch in GitHub:

`v1.x-2022-10`

Because Changesets doesn't yet have support for manual Git versions, this will require a manual step in changing the package.json version number to bump it to the correct month or year. We can deal with that.

## What happens...?

### If we introduce breaking changes into the Hydrogen framework?

Similar to when we release new major versions of the SFAPI, we'll cut a new branch for major version releases of the Hydrogen framework and make it the default in GitHub:

`v2.x-2022-10`

Note that this means we now have two "most recent major versions" to account for in patches. This will be annoying for a little while, since we will need to patch two major releases concurrently:

`v1.x-2022-10`

`v2.x-2022-10`

At least until we bump to the new version of storefront-kit-react, and we'll be back to just maintaining a single one:

`v2.x-2023-01`

### When we add new features?

Developers should add new features to the latest stable version branch (aka the default branch in GitHub).

At a regular cadence --- at least weekly --- Hydrogen core maintainers should pull the commits to the latest version upstream to the `unstable` branch, if there are any missing. Sometimes, this will be messy and involve merge conflicts, so it needs to be an intentional (read: not automated) step.

### When we patch previous versions?

1.  Developers will check out the major version branch they need to apply the patch to

2.  They will make the patch

3.  They will open a PR against that branch, and get it approved

4.  Changesets opens a Release PR against that major version branch

5.  Developers merge that branch and release on Shipit

6.  (If applicable) Developers check out other major version branches where the patch applies and repeat steps 1-5.

### If we want to do a formal RC/alpha/beta tag in addition to `unstable`?

Leading up to a new major release, we might want to issue release candidates. To do this, we would open a branch named after the upcoming major version release and turn it into [Changesets pre mode](https://github.com/atlassian/changesets/blob/main/docs/prereleases.md). We would treat the most recent stable version. When we're ready to go stable, we simply exit pre mode.

Note: this gets a bit messy, because pre mode does make changes to package versions and changelogs. It will make merging stuff from `unstable` more tricky, and it can bloat the changelog. We can probably get around this with manual changelog grooming.

### If we introduce storefront-kit-react-vue?

Vue (and other potential variants of React Storefront Kit) will be pinned to the SFAPI, too. We will not be creating other variants of the framework, so we don't need to worry about factoring another SemVer into the equation.

### To the demo store templates?

The demo store templates will be affected by both Hydrogen and React Storefront Kit. This means that this versioning and branching strategy is a perfect fit. Scaffolding CLIs are unique because only their latest versions are intended to be used. This means we don't need to be concerned about versioning here.

### To the linter packages and any other semver packages we might include in the Hydrogen monorepo?

They can be chill in the most recent major release Git branch. They are less frequently updated. There will be breaking changes from time to time, but we will be less committed to issuing patch releases to them.

### To the `main` branch?

It's on GitHub, but we don't use it anymore. We sync to it for convenience of canonical links, etc.
