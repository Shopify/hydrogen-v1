## Return value

The `useProduct` hook returns an object with the following keys, as well as all keys from the [`useProductOptions` hook return value](/api/hydrogen/hooks/product-variant/useproductoptions):

| Name | Description |
| ---- | ----------- |
| `title`   | The product's title. |
| `descriptionHtml` | The product description as an HTML string. |
| `media` | An array of all the media `nodes` from the product's `mediaConnection`. |
| `mediaConnection` | The product's raw media connection. |
| `variants` | An array of all the variant `nodes` from the product's `variantsConnection`. |
| `variantsConnection` | The product's raw variant connection. |
| `minPrice` | The product's minimum price. |
| `maxPrice` | The product's maximum price. |
| `compareAtMinPrice` | The product's minimum compare at price. |
| `compareAtMaxPrice` | The product's maximum compare at price. |
