## Return value

This hook returns a single object with the following keys:

| Key                             | Description                                                                   |
| ------------------------------- | ----------------------------------------------------------------------------- |
| `variants`                      | An array of the variant `nodes` from the `VariantConnection`.                 |
| `options`                       | An array of the product's options and values.                                 |
| `selectedVariant`               | The selected variant.                                                         |
| `setSelectedVariant`            | A callback to set the selected variant to the variant passed as an argument.  |
| `selectedOptions`               | The current selected options.                                                 |
| `setSelectedOption`             | A callback to set the selected option.                                        |
| `setSelectedOptions`            | A callback to set multiple selected options at once.                          |
| `isOptionInStock`               | A callback that returns a boolean indicating if the option is in stock.       |
| `setSelectedSellingPlan`        | A callback to set the selected selling plan to the one passed as an argument. |
| `selectedSellingPlan`           | The selected selling plan.                                                    |
| `selectedSellingPlanAllocation` | The selected selling plan allocation.                                         |
| `sellingPlanGroups`             | The selling plan groups.                                                      |
