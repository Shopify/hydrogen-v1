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
