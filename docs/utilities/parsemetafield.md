---
gid: ec647578-6ab7-40ca-87e5-8a559eca548e
title: parseMetafield
description: The parseMetafield utility creates a new metafield object with a value that has been parsed according to the metafield type.
---

The `parseMetafield` utility creates a new metafield object with a value that has been parsed according to the metafield type.

## Example code

```tsx
import {useParsedMetafields, Metafield} from '@shopify/hydrogen';

export function Product(product) {
  const metafield = parseMetafield(product.metafield);

  return (
    <div>
      {metafield.value}
    </div>
  );
}
```

You can also wrap `parseMetafield` in `useMemo()` to maintain a stable object identity across renders.

```tsx
import {useMemo} from 'react'
import {useParsedMetafields, Metafield} from '@shopify/hydrogen';

export function Product(product) {
  const metafield = useMemo(() => parseMetafield(product.metafield), [product.metafield]);

  return (
    <div>
      {metafield.value}
    </div>
  );
}
```

## Arguments

This hook takes a single object with the following key:

| Key         | Type                                                  | Description                                                                                               |
| ----------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| metafields? | <code>PartialDeep&#60;MetafieldConnection&#62;</code> | A [MetafieldConnection](https://shopify.dev/api/storefront/reference/common-objects/metafieldconnection). |

## Return type

This hook returns an array of metafields whose `values` have been parsed according to the metafield `type`. For details on the parsed value, refer to the [`parseMetafieldValue`](https://shopify.dev/api/hydrogen/utilities/parsemetafieldvalue) utility.

## Related utilities

- [`parseMetafieldValue`](https://shopify.dev/api/hydrogen/utilities/parsemetafieldvalue)
