---
gid: ec647578-6ab7-40ca-87e5-8a559eca548e
title: useParsedMetafields
description: The useParsedMetafields hook transforms a MetafieldConnection in an array of metafields whose values have been parsed according to the metafield type.
---

The `useParsedMetafields` hook transforms a [MetafieldConnection](https://shopify.dev/api/storefront/reference/common-objects/metafieldconnection)
in an array of metafields whose `values` have been parsed according to the metafield `type`.

## Example code

```tsx
import {useParsedMetafields, Metafield} from '@shopify/hydrogen';

export function Product(product) {
  const metafields = useParsedMetafields(product.metafields);

  return (
    <ul>
      {metafields.map((field) => {
        return (
          <li>
            <Metafield data={field} />
          </li>
        );
      })}
    </ul>
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
