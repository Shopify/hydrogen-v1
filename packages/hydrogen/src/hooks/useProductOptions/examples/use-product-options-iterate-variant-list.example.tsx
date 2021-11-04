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
            variants.find((variant) => variant.id === e.target.value)
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
