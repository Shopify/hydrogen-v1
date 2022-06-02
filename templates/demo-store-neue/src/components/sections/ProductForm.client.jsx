import {useEffect} from 'react';
import {useProduct, useUrl, useNavigate} from '@shopify/hydrogen';
import {Heading, Text} from '~/components/elements';

export default function ProductForm() {
  const {pathname, search} = useUrl();
  const navigate = useNavigate();

  let params = new URLSearchParams(search);

  const {options, setSelectedOption, selectedOptions} = useProduct();

  useEffect(() => {
    options.map(({name, values}) => {
      const currentValue = params.get(name.toLowerCase());
      if (currentValue) {
        const matchedValue = values.filter(
          (value) => value.toLowerCase() === currentValue,
        );
        setSelectedOption(name, matchedValue[0]);
      }
    });
  }, []);

  function handleChange(name, value) {
    setSelectedOption(name, value);
    params.set(
      encodeURIComponent(name.toLowerCase()),
      encodeURIComponent(value.toLowerCase()),
    );
    navigate(
      `${pathname}?${params.toString()}`,
      {replace: true},
      {reloadDocument: false},
    );
  }

  return (
    <form>
      {
        <>
          {options.map(({name, values}) => {
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
                            checked ? 'bg-gray-900 text-white' : 'text-gray-900'
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
    </form>
  );
}
