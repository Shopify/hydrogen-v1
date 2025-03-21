# Changelog

## 0.12.5

### Patch Changes

- Update provenance ([#2568](https://github.com/Shopify/hydrogen-v1/pull/2568)) by [@blittle](https://github.com/blittle)

## 0.12.4

### Patch Changes

- Add provenance statement to NPM ([#2566](https://github.com/Shopify/hydrogen-v1/pull/2566)) by [@blittle](https://github.com/blittle)

## 0.12.3

### Patch Changes

- Updates links to https://shopify.dev/custom-storefronts/hydrogen in favor of a new information architecture. We've split out conceptual material from procedural material and organized the content by area of work. ([#2326](https://github.com/Shopify/hydrogen/pull/2326)) by [@rennyG](https://github.com/rennyG)

## 0.12.2

### Patch Changes

- [#1373](https://github.com/Shopify/hydrogen/pull/1373) [`66fdc75c`](https://github.com/Shopify/hydrogen/commit/66fdc75c3494acbb668b1053cac24846ed522217) Thanks [@cartogram](https://github.com/cartogram)! - This package now supports eslint >= 8

* [#1367](https://github.com/Shopify/hydrogen/pull/1367) [`9514271c`](https://github.com/Shopify/hydrogen/commit/9514271c709f717dfdbdd5620b17661f6ebba651) Thanks [@cartogram](https://github.com/cartogram)! - Updates default hydrogen eslint config to ignore `rule-of-hooks` rule inside server components.

## 0.12.1

### Patch Changes

- [#999](https://github.com/Shopify/hydrogen/pull/999) [`66cc632a`](https://github.com/Shopify/hydrogen/commit/66cc632a00123b1a5fffcd234c25a91e1a86bdf7) Thanks [@cartogram](https://github.com/cartogram)! - Fixes the rule: `server-component-banned-hooks` to allow the banned hooks in shared components.

## 0.12.0

### Minor Changes

- [#877](https://github.com/Shopify/hydrogen/pull/877) [`a362a5dd`](https://github.com/Shopify/hydrogen/commit/a362a5dd02e94c7cdf62bb8d0d7e52e8676b415c) Thanks [@cartogram](https://github.com/cartogram)! - Breaking Change: New rules `client-component-banned-hooks` and `server-component-banned-hooks` added as generic rules to ban any non-supported hooks in each context. `server-component-banned-hooks` combines and replaces the `no-state-in-server-components` and `no-effects-in-server-components` rules. `client-component-banned-hooks` will flag usage of `useQuery` and `useShopQuery` in client components.

## 0.11.0 - 2022-02-24

- No updates. Transitive dependency bump.

## 0.10.0 - 2022-01-25

- No updates. Transitive dependency bump.

## 0.9.0 - 2022-01-20

- No updates. Transitive dependency bump.

## 0.8.0 - 2021-12-07

- No updates. Transitive dependency bump.

## 0.7.1 - 2021-12-02

- No updates. Transitive dependency bump.

## 0.7.0 - 2021-11-22

- New rule `hydrogen/no-effect-in-server-components`. This rule prevents using `useEffect` and `useLayoutEffect` in non-client components.

## 0.6.2 - 2021-11-10

- Added new `hydrogen/typescript` config
- Added `env#node: true` and `parserOptions#sourceType: 'module'` to core config
- Fixed issue requiring typescript to be install on non-typescript projects

## 0.6.0 - 2021-11-05

- No updates. Transitive dependency bump.

## 0.5.0 - 2021-11-01

- No updates. Transitive dependency bump.

## 0.4.0 - 2021-10-27

- No updates. Transitive dependency bump.

## 0.3.0 - 2021-10-20

- No updates. Transitive dependency bump.

## 0.2.1 - 2021-10-12

- No updates. Transitive dependency bump.

## 0.2.0 - 2021-10-08

- No updates. Transitive dependency bump.

## 0.1.3 - 2021-10-04

- New rule `hydrogen/prefer-image-component`

## 0.1.2 - 2021-09-30

- Added `recommended-typescript` config for typescript projects

## 0.1.0 - 2021-09-23

- No updates. Transitive dependency bump.

## 1.0.0-alpha.22 - 2021-09-22

- No updates. Transitive dependency bump.
