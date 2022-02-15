import {
  SelectedVariantAddToCartButton,
  ProductProvider,
  useProduct,
} from '@shopify/hydrogen';

export function ProductDetails({product}) {
  return (
    <ProductProvider value={product}>
      <ProductOptions />
      <SelectedVariantAddToCartButton>
        Add to cart
      </SelectedVariantAddToCartButton>
    </ProductProvider>
  );
}

function ProductOptions() {
  const {options, setSelectedOption, selectedOptions} = useProduct();

  return options.map(({name, values}) => {
    return (
      <fieldset key={name}>
        <legend>{name}</legend>
        <div>
          {values.map((value) => {
            return (
              <label key={id} htmlFor={id}>
                <input
                  type="radio"
                  id={id}
                  name={`option-${name}`}
                  value={value}
                  checked={checked}
                  onChange={() => setSelectedOption(name, value)}
                />
                {value}
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  });
}
