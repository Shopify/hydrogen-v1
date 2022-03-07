---
'@shopify/hydrogen': minor
---

Move any static `Fragment` properties on components to the entry point `@shopify/hydrogen/fragments`.
The migration diff are as follows:

```diff
- import {ExternalVideoFragment} from '@shopify/hydrogen';
+ import {ExternalVideoFragment} from '@shopify/hydrogen/fragments';
- import type {ExternalVideoFragmentFragment} from '@shopify/hydrogen';
+ import type {ExternalVideoFragmentFragment} from '@shopify/hydrogen/fragments';
```

```diff
- import {ImageFragment} from '@shopify/hydrogen';
+ import {ImageFragment} from '@shopify/hydrogen/fragments';
- import type {ImageFragmentFragment} from '@shopify/hydrogen';
+ import type {ImageFragmentFragment} from '@shopify/hydrogen/fragments';
```

```diff
- import {MediaFileFragment} from '@shopify/hydrogen';
+ import {MediaFileFragment} from '@shopify/hydrogen/fragments';
- import type {MediaFileFragmentFragment} from '@shopify/hydrogen';
+ import type {MediaFileFragmentFragment} from '@shopify/hydrogen/fragments';
```

```diff
- import {MetafieldFragment} from '@shopify/hydrogen';
+ import {MetafieldFragment} from '@shopify/hydrogen/fragments';
- import type {MetafieldFragmentFragment} from '@shopify/hydrogen';
+ import type {MetafieldFragmentFragment} from '@shopify/hydrogen/fragments';
```

```diff
- import {Model3DFragment} from '@shopify/hydrogen';
+ import {Model3DFragment} from '@shopify/hydrogen/fragments';
- import type {Model3DFragmentFragment} from '@shopify/hydrogen';
+ import type {Model3DFragmentFragment} from '@shopify/hydrogen/fragments';
```

```diff
- import {MoneyFragment} from '@shopify/hydrogen';
+ import {MoneyFragment} from '@shopify/hydrogen/fragments';
- import type {MoneyFragmentFragment} from '@shopify/hydrogen';
+ import type {MoneyFragmentFragment} from '@shopify/hydrogen/fragments';
```

```diff
- import {ProductProviderFragment} from '@shopify/hydrogen';
+ import {ProductProviderFragment} from '@shopify/hydrogen/fragments';
- import type {ProductProviderFragmentFragment} from '@shopify/hydrogen';
+ import type {ProductProviderFragmentFragment} from '@shopify/hydrogen/fragments';
```

```diff
- import {UnitPriceFragment} from '@shopify/hydrogen';
+ import {UnitPriceFragment} from '@shopify/hydrogen/fragments';
- import type {UnitPriceFragmentFragment} from '@shopify/hydrogen';
+ import type {UnitPriceFragmentFragment} from '@shopify/hydrogen/fragments';
```

```diff
- import {VideoFragment} from '@shopify/hydrogen';
+ import {VideoFragment} from '@shopify/hydrogen/fragments';
- import type {VideoFragmentFragment} from '@shopify/hydrogen';
+ import type {VideoFragmentFragment} from '@shopify/hydrogen/fragments';
```
