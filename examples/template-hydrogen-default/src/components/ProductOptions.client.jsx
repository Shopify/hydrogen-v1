import {useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {useProduct} from '@shopify/hydrogen/client';

/**
 * A client component that tracks a selected variant and/or selling plan state, as well as callbacks for modifying the state
 */
export default function ProductOptions() {
  const {options, setSelectedOption, selectedOptions, setSelectedOptions} =
    useProduct();
  const history = useHistory();

  useEffect(() => {
    const params = new URLSearchParams(history.location.search);

    params.forEach((value, name) => {
      selectedOptions[name] = value;
    });

    history.replace({
      search: params.toString(),
    });

    setSelectedOptions(selectedOptions);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(selectedOptions);

    history.replace({
      search: params.toString(),
    });
  }, [history, selectedOptions]);

  return (
    <>
      {options.map(({name, values}) => {
        return (
          <fieldset key={name} className="mt-8">
            <legend className="mb-4 text-xl font-medium text-gray-900">
              {name}
            </legend>
            <div className="flex items-center flex-wrap gap-4">
              {values.map((value) => {
                const checked = selectedOptions[name] === value;
                const id = `option-${name}-${value}`;

                return (
                  <label key={id} htmlFor={id}>
                    <input
                      className="sr-only"
                      type="radio"
                      id={id}
                      name={`option[${name}]`}
                      value={value}
                      checked={checked}
                      onChange={() => setSelectedOption(name, value)}
                    />
                    <div
                      className={`p-2 border cursor-pointer rounded text-sm md:text-md ${
                        checked ? 'bg-gray-900 text-white' : 'text-gray-900'
                      }`}
                    >
                      {value}
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </>
  );
}
