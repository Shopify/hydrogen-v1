## Arguments

This hook takes a single object with the following keys:

| Key                | Type                                                         | Description                        |
| ------------------ | ------------------------------------------------------------ | ---------------------------------- |
| variants?          | <code>PartialDeep&#60;ProductVariantConnection&#62;</code>   | The product's `VariantConnection`. |
| sellingPlanGroups? | <code>PartialDeep&#60;SellingPlanGroupConnection&#62;</code> | The product's `SellingPlanGroups`. |
| initialVariantId?  | <code>ProductVariantType['id']</code>                        | The initially selected variant.    |
