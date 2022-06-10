import {useEffect, useCallback, useRef, useState} from 'react';
import {
  useProductOptions,
  isBrowser,
  useUrl,
  AddToCartButton,
  ShopPayButton,
} from '@shopify/hydrogen';

import {Heading, Text, Button} from '~/components/elements';

export function ProductForm() {
  const {pathname, search} = useUrl();
  const [params, setParams] = useState(new URLSearchParams(search));
  const buttonRef = useRef();

  const {options, setSelectedOption, selectedOptions, selectedVariant} =
    useProductOptions();

  const isOutOfStock = !selectedVariant?.availableForSale || false;

  useEffect(() => {
    options.map(({name, values}) => {
      if (params) {
        const currentValue = params.get(name.toLowerCase()) || null;
        if (currentValue) {
          const matchedValue = values.filter(
            (value) => encodeURIComponent(value.toLowerCase()) === currentValue,
          );
          setSelectedOption(name, matchedValue[0]);
        } else {
          setParams(
            params.set(
              encodeURIComponent(name.toLowerCase()),
              encodeURIComponent(selectedOptions[name].toLowerCase()),
            ),
          );
          window.history.replaceState(
            null,
            '',
            `${pathname}?${params.toString()}`,
          );
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = useCallback(
    (name, value) => {
      setSelectedOption(name, value);
      params.set(
        encodeURIComponent(name.toLowerCase()),
        encodeURIComponent(value.toLowerCase()),
      );
      if (isBrowser()) {
        window.history.replaceState(
          null,
          '',
          `${pathname}?${params.toString()}`,
        );
      }
    },
    [setSelectedOption, params, pathname],
  );

  return (
    <form>
      {
        <>
          {options.map(({name, values}) => {
            if (values.length === 1) {
              return null;
            }
            return (
              <fieldset key={name} className="mt-8">
                <Heading as="legend" size="lead">
                  {name}
                </Heading>
                <div className="flex flex-wrap items-center gap-4">
                  {values.map((value) => {
                    const checked = selectedOptions[name] === value;
                    const id = `option-${name}-${value}`;

                    return (
                      <Text as="label" key={id} htmlFor={id}>
                        <input
                          className="sr-only"
                          type="radio"
                          id={id}
                          name={`option[${name}]`}
                          value={value}
                          checked={checked}
                          onChange={() => handleChange(name, value)}
                        />
                        <div
                          className={`p-2 border cursor-pointer rounded text-sm md:text-md ${
                            checked
                              ? 'bg-primary text-contrast'
                              : 'text-primary'
                          }`}
                        >
                          {value}
                        </div>
                      </Text>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}
        </>
      }
      <div>
        <AddToCartButton
          variantId={selectedVariant.id}
          quantity={1}
          attributes={[{key: 'Engraving', value: 'Hello world'}]}
          accessibleAddingToCartLabel="Adding item to your cart"
          disabled={isOutOfStock}
          onClick={(event) => {
            event.preventDefault();
            console.log('this is happening');
            console.log(buttonRef.current);
          }}
          buttonRef={buttonRef}
        >
          <Button as="span">
            {isOutOfStock ? 'Out of stock' : 'Add to bag'}
          </Button>
        </AddToCartButton>
        {isOutOfStock ? (
          <p className="text-center text-black">Available in 2-3 weeks</p>
        ) : (
          <ShopPayButton
            variantIdsAndQuantities={[{id: selectedVariant.id, quantity: 1}]}
          >
            Buy it now
          </ShopPayButton>
        )}
      </div>
    </form>
  );
}
