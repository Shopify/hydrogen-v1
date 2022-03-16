# Changelog

## 0.12.0

### Minor Changes

- [#809](https://github.com/Shopify/hydrogen/pull/809) [`47f23f9`](https://github.com/Shopify/hydrogen/commit/47f23f921873b782947aed2e54d997ad034801b8) Thanks [@frehner](https://github.com/frehner)! - Upgrade default Storefront API to version '2022-04'. Some components have been updated to use the 2022-04 features and types as well.

  One important change is that the `2022-04` Storefront API no longer encodes object IDs: see more [details here](https://shopify.dev/api/release-notes/2022-04#non-encoded-object-ids-in-the-graphql-storefront-api). Because of this, Hydrogen will no longer decode IDs, either, which will cause issues if you are using a previous version of the Storefront API with Hydrogen components.

## 0.11.1

### Patch Changes

- [#782](https://github.com/Shopify/hydrogen/pull/782) [`72144ff`](https://github.com/Shopify/hydrogen/commit/72144ffae98054b7165579062f0e8e521ad0d032) Thanks [@michenly](https://github.com/michenly)! - Removes the duplicate bin keys in the hydrogen-cli package.json

## 0.11.0 - 2022-02-24

- Improves some types, avoid using `any` in `mini-oxygen`

## 0.10.1 - 2022-01-26

- Adds command hooks `onCommit` and `onUpdateFile`

## 0.10.0 - 2022-01-25

- Adds `dev` command for running Hydrogen apps locally with vite
- Adds `preview` command for running Hydrogen apps in a local Worker runtime
- Prevent CLI commands from unintentionally mutating the app code
- Adds cache support for `preview` command

## 0.9.1 - 2022-01-20

- No updates. Transitive dependency bump.

## 0.9.0 - 2022-01-20

- No updates. Transitive dependency bump.

## 0.8.3 - 2022-01-13

- New command: `check`, for running audits on the current project to look for common problems
- New command: add, to run an atomic change to a project (ie: `hydrogen add lint`)

## 0.8.1 - 2022-01-04

- No updates. Transitive dependency bump.

## 0.8.0 - 2021-12-07

- No updates. Transitive dependency bump.

## 0.7.1 - 2021-12-02

- No updates. Transitive dependency bump.

## 0.7.0 - 2021-11-22

- No updates. Transitive dependency bump.

## 0.6.4 - 2021-11-11

- No updates. Transitive dependency bump.

## 0.6.2 - 2021-11-10

- Add ability to explicitly set the root for the running command using the `--root` flag

## 0.6.0 - 2021-11-05

- Add create page command [#810](https://github.com/Shopify/hydrogen/pull/810)
- Add create component command [#806](https://github.com/Shopify/hydrogen/pull/806)
- Add init command [#791](https://github.com/Shopify/hydrogen/pull/791)

## 0.5.8 - 2021-11-04

- No updates. Transitive dependency bump.

## 0.5.1 - 2021-11-02

- No updates. Transitive dependency bump.

## 0.5.0 - 2021-11-01

- No updates. Transitive dependency bump.

## 0.4.2 - 2021-10-29

- No updates. Transitive dependency bump.

## 0.4.0 - 2021-10-27

- No updates. Transitive dependency bump.

## 0.3.0 - 2021-10-20

- No updates. Transitive dependency bump.

## 0.2.1 - 2021-10-12

- No updates. Transitive dependency bump.

## 0.2.0 - 2021-10-08

- No updates. Transitive dependency bump.

## 0.1.2 - 2021-09-30

- Fixed error when creating a PWA app

- Fix no-lint setting from generating an invalid script.

## 0.1.0 - 2021-09-23

- No updates. Transitive dependency bump.

## 1.0.0-alpha.22 - 2021-09-22

- No updates. Transitive dependency bump.
