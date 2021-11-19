<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/hooks/useProductOptions and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/master/content/internal/operations/hydrogen-reference-docs.md. -->

The `useProductOptions` hook returns an object that enables you to keep track of the
selected variant and/or selling plan state, as well as callbacks for modifying the state.

## Example code

```tsx
/**
 * Iterate through a list of variants and allow the customer to select a specific variant.
 */
import {useProductOptions} from '@shopify/hydrogen';

export function MyComponent() {
  const {variants, selectedVariant, setSelectedVariant} = useProductOptions({
    variants: product.variants,
  });

  return (
    <>
      <label htmlFor="variants">Select a variant</label>
      <select
        id="variants"
        name="variants"
        value={selectedVariant?.id}
        onChange={(e) =>
          setSelectedVariant(
            variants.find((variant) => variant.id === e.target.value),
          )
        }
      >
        {variants.map((variant) => (
          <option key={variant.id} value={variant.id}>
            {variant.title}
          </option>
        ))}
      </select>
    </>
  );
}
```

```tsx
/**
 * Support selling plans. You should display a selling plan selector to a user
 * when a product has selling plans enabled. You need to pass `sellingPlanGroups` to the hook.
 */
import {useProductOptions} from '@shopify/hydrogen';

export function MyComponent() {
  const {
    selectedSellingPlan,
    setSelectedSellingPlan,
    selectedSellingPlanAllocation,
    sellingPlanGroups,
  } = useProductOptions({
    variants: product.variants,
    sellingPlanGroups: product.sellingPlanGroups,
    initialVariantId: product.variants.edges[0].node.id,
  });

  return (
    <>
      {/* Code for your variant selector goes here */}

      {sellingPlanGroups.map((sellingPlanGroup) => (
        <div key={sellingPlanGroup.id}>
          <h2>{sellingPlanGroup.name}</h2>
          <ul>
            {sellingPlanGroup.sellingPlans.map((sellingPlan) => {
              return (
                <li key={sellingPlan.id}>
                  <button onClick={() => setSelectedSellingPlan(sellingPlan)}>
                    {sellingPlan.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}
```

```tsx
/**
 * Use product options.
 */
import {useProductOptions} from '@shopify/hydrogen';

export function MyComponent() {
  const {options, selectedVariant, selectedOptions, setSelectedOption} =
    useProductOptions({variants: product.variants});

  return (
    <>
      {options.map(({name, values}) => (
        <fieldset key={name}>
          <legend>{name}</legend>
          {values.map((value) => (
            <label htmlFor={`option[${name}][${value}]`}>
              <input
                type="radio"
                id={`option[${name}][${value}]`}
                name={`option[${name}]`}
                checked={selectedOptions[name] === value}
                onChange={() => setSelectedOption(name, value)}
              />
              {value}
            </label>
          ))}
        </fieldset>
      ))}
    </>
  );
}
```

#### Considerations

- If your product requires a selling plan, then make sure to display that as required in your user interface. If it doesn't require a selling plan, then you might want to offer a "one-time purchase" option which triggers `setSelectedSellingPlan(null)`.
- You can use `selectedSellingPlanAllocation` to display the price adjustments for the selected variant when a given selling plan is active.

## Arguments

This hook takes a single object with the following keys:

| Key                 | Required | Description                        |
| ------------------- | -------- | ---------------------------------- |
| `variants`          | No       | The product's `VariantConnection`. |
| `sellingPlanGroups` | No       | The product's `SellingPlanGroups`. |
| `initialVariantId`  | No       | The initially selected variant.    |

## Return value

This hook returns a single object with the following keys:

| Key                             | Description                                                                   |
| ------------------------------- | ----------------------------------------------------------------------------- |
| `variants`                      | An array of the variant `nodes` from the `VariantConnection`.                 |
| `options`                       | An array of the product's options and values.                                 |
| `selectedVariant`               | The selected variant.                                                         |
| `setSelectedVariant`            | A callback to set the selected variant to the variant passed as an argument.  |
| `setSelectedOption`             | A callback to set the selected option.                                        |
| `setSelectedOptions`            | A callback to set multiple selected options at once.                          |
| `isOptionInStock`               | A callback that returns a boolean indicating if the option is in stock.       |
| `setSelectedSellingPlan`        | A callback to set the selected selling plan to the one passed as an argument. |
| `selectedSellingPlan`           | The selected selling plan.                                                    |
| `selectedSellingPlanAllocation` | The selected selling plan allocation.                                         |
| `sellingPlanGroups`             | The selling plan groups.                                                      |

## GraphQL fragment

The following GraphQL fragment is available for your queries as `VariantFragment`. Using this query ensures that you have all the data necessary for the `useProductOptions` hook.

```graphql
fragment VariantFragment on ProductVariant {
  id
  title
  availableForSale
  image {
    ...ImageFragment
  }
  ...UnitPriceFragment
  priceV2 {
    ...MoneyFragment
  }
  compareAtPriceV2 {
    ...MoneyFragment
  }
  selectedOptions {
    name
    value
  }
  metafields(first: $numProductVariantMetafields) {
    edges {
      node {
        ...MetafieldFragment
      }
    }
  }
  sellingPlanAllocations(first: $numProductVariantSellingPlanAllocations) {
    edges {
      node {
        priceAdjustments {
          compareAtPrice {
            ...MoneyFragment
          }
          perDeliveryPrice {
            ...MoneyFragment
          }
          price {
            ...MoneyFragment
          }
          unitPrice {
            ...MoneyFragment
          }
        }
        sellingPlan {
          ...SellingPlanFragment
        }
      }
    }
  }
}
```

### Variables

The `ProductProviderFragment` includes variables that you will need to provide values for when performing your query.

| Variable                                   | Description                                                                                           |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `$numProductVariantMetafields`             | The number of `Metafield` objects to query for in a variant's `MetafieldConnection`.                  |
| `$numProductVariantSellingPlanAllocations` | The number of `SellingPlanAllocations` to query for in a variant's `SellingPlanAllocationConnection`. |
| `$numProductSellingPlanGroups`             | The number of `SellingPlanGroups` objects to query for in a `SellingPlanGroupConnection`.             |
| `$$numProductSellingPlans`                 | The number of `SellingPlan` objects to query for in a `SellingPlanConnection`.                        |

## Related hooks

- [`useProduct`](/api/hydrogen/hooks/product-variant/useproduct)
