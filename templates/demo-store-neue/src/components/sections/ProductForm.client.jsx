import {useProduct} from '@shopify/hydrogen';
import {Heading, Text} from '~/components/elements';

export default function ProductForm() {
  const {options, setSelectedOption, selectedOptions} = useProduct();
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
                          onChange={() => setSelectedOption(name, value)}
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
