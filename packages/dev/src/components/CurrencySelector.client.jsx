import {useCallback} from 'react';
import {useAvailableCountries, useCountry} from '@shopify/hydrogen/client';
import {Listbox} from '@headlessui/react';

export default function CurrencySelector() {
  const countries = useAvailableCountries();
  const [selectedCountry, setSelectedCountry] = useCountry();

  const setCountry = useCallback(
    (isoCode) => {
      setSelectedCountry(
        countries.find((country) => country.isoCode === isoCode),
      );
    },
    [countries, setSelectedCountry],
  );

  return (
    <div className="hidden lg:block">
      <Listbox onChange={setCountry}>
        <Listbox.Button className="font-medium text-sm h-8 p-2 w-16">
          {selectedCountry.currency.isoCode}
        </Listbox.Button>

        <Listbox.Options className="absolute z-10 mt-2 border-t-4 border-blue-600">
          <div className="bg-white w-28 border-2 border-black">
            <Listbox.Option
              disabled
              className="p-2 text-sm text-left font-bold"
            >
              Currency
            </Listbox.Option>
            {countries.map((country) => {
              const isSelected = country.isoCode === selectedCountry.isoCode;
              return (
                <Listbox.Option key={country.isoCode} value={country.isoCode}>
                  {({active}) => (
                    <div
                      className={`p-2 flex justify-between items-center text-left w-full cursor-pointer ${
                        isSelected ? 'font-medium' : null
                      } ${active ? 'bg-gray-200' : null}`}
                    >
                      {country.currency.isoCode}
                      {isSelected ? <CheckIcon /> : null}
                    </div>
                  )}
                </Listbox.Option>
              );
            })}
          </div>
        </Listbox.Options>
      </Listbox>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="mr-2"
      width="14"
      height="10"
      viewBox="0 0 14 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.7071 0.292893C14.0976 0.683417 14.0976 1.31658 13.7071 1.70711L5.70711 9.70711C5.31658 10.0976 4.68342 10.0976 4.29289 9.70711L0.292893 5.70711C-0.0976311 5.31658 -0.0976311 4.68342 0.292893 4.29289C0.683417 3.90237 1.31658 3.90237 1.70711 4.29289L5 7.58579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893Z"
        fill="#354CF6"
      />
    </svg>
  );
}
