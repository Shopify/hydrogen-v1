# Rust Example

Hydrogen is a React framework and SDK that you can use to build fast and dynamic Shopify custom storefronts.

[Check out the docs](https://shopify.dev/custom-storefronts/hydrogen)

## Getting started

**Requirements:**

- Node.js version 16.14.0 or higher
- Yarn
- Rust
- wasm-pack

Installing [Rust](https://www.rust-lang.org/tools/install):

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Installing [wasm-pack](https://github.com/rustwasm/wasm-pack):

```sh
cargo install wasm-pack
```

Build rust lib and add the lib into dependency

```bash
npx degit Shopify/hydrogen/examples/rust hydrogen-app && cd hydrogen-app
yarn
yarn build:wasm:nodejs or wasm-pack build --target nodejs
yarn add ./rust-functions/pkg
```

`rust-functions` is an example lib here. If you need your own lib, please try this:

```sh
cargo new --lib <library-name>
yarn add ./<library-name>/pkg
```

## Start server

```bash
yarn
yarn dev
```

Remember to update `hydrogen.config.ts` with your shop's domain and Storefront API token!

## Building for production

```bash
yarn build
```

Deploying to production will vary based on your hosting provider. Currently, Oxygen does not support Rust-based projects.

## Previewing a production build

To run a local preview of your Hydrogen app in an environment similar to Oxygen, build your Hydrogen app and then run `yarn preview`:

```bash
yarn build
yarn preview
```
