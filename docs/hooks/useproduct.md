---
gid: c850ae3e-fafd-11eb-9a03-0242ac130004
title: useProduct
description: The useProduct hook returns the product object of the nearest ProductProvider.
---

The `useProduct` hook returns the product object of the nearest `ProductProvider`. It must be a descendent of
a `ProductProvider` component.

## Example code

```tsx
import {useProduct} from '@shopify/hydrogen';

export function CustomAddToCartButton() {
  const {title, description} = useProduct();

  return (
    <>
      <h1>{title}</h1>
      <p>{description}</p>
    </>
  );
}
```

## Return value

The `useProduct` hook returns an object with the following keys, as well as all keys from the [`useProductOptions` hook return value](https://shopify.dev/api/hydrogen/hooks/product-variant/useproductoptions):

| Name                 | Description                                                                  |
| -------------------- | ---------------------------------------------------------------------------- |
| `title`              | The product's title.                                                         |
| `descriptionHtml`    | The product description as an HTML string.                                   |
| `media`              | An array of all the media `nodes` from the product's `mediaConnection`.      |
| `mediaConnection`    | The product's raw media connection.                                          |
| `variants`           | An array of all the variant `nodes` from the product's `variantsConnection`. |
| `variantsConnection` | The product's raw variant connection.                                        |
| `minPrice`           | The product's minimum price.                                                 |
| `maxPrice`           | The product's maximum price.                                                 |
| `compareAtMinPrice`  | The product's minimum compare at price.                                      |
| `compareAtMaxPrice`  | The product's maximum compare at price.                                      |

## Related components

- [`ProductProvider`](https://shopify.dev/api/hydrogen/components/product-variant/productprovider)
