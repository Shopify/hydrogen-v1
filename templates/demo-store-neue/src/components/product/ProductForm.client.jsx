import {useEffect, useCallback, useState} from 'react';
import {
  useProductOptions,
  isBrowser,
  useUrl,
  AddToCartButton,
  BuyNowButton,
  Money,
} from '@shopify/hydrogen';

import {Heading, Text, Button} from '~/components';

export function ProductForm() {
  const {pathname, search} = useUrl();
  const [params, setParams] = useState(new URLSearchParams(search));

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
    <form className="grid gap-10">
      {
        <div className="grid gap-4">
          {options.map(({name, values}) => {
            if (values.length === 1) {
              return null;
            }
            return (
              <div
                key={name}
                className="flex flex-wrap items-baseline justify-start gap-6"
              >
                <Heading as="legend" size="lead" className="min-w-[4rem]">
                  {name}
                </Heading>
                <div className="flex flex-wrap items-baseline gap-4">
                  <OptionRadio
                    name={name}
                    handleChange={handleChange}
                    values={values}
                  />
                </div>
              </div>
            );
          })}
        </div>
      }
      <div className="grid items-stretch gap-4">
        <AddToCartButton
          variantId={selectedVariant.id}
          quantity={1}
          accessibleAddingToCartLabel="Adding item to your cart"
          disabled={isOutOfStock}
        >
          <Button
            width="full"
            variant={isOutOfStock ? 'secondary' : 'primary'}
            as="span"
          >
            {isOutOfStock ? (
              <Text>Sold out</Text>
            ) : (
              <Text as="span">
                Add to bag - <Money data={selectedVariant.priceV2} as="span" />
              </Text>
            )}
          </Button>
        </AddToCartButton>
        {!isOutOfStock && (
          <BuyNowButton quantity={1} variantId={selectedVariant.id}>
            <Button width="full" variant="secondary" as="span">
              Buy it now
            </Button>
          </BuyNowButton>
        )}
      </div>
    </form>
  );
}

function OptionRadio({values, name, handleChange}) {
  const {selectedOptions} = useProductOptions();

  return (
    <>
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
              className={`leading-none py-1 border-b-[1.5px] cursor-pointer transition-all duration-200 ${
                checked ? 'border-primary/50' : 'border-primary/0'
              }`}
            >
              {value}
            </div>
          </Text>
        );
      })}
    </>
  );
}
