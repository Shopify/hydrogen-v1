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
        {({open}) => (
          <>
            <Listbox.Button className="font-medium text-sm h-8 p-2 flex items-center">
              <span className="mr-4">{selectedCountry.currency.isoCode}</span>
              <ArrowIcon isOpen={open} />
            </Listbox.Button>

            <Listbox.Options className="absolute z-10 mt-2">
              <div className="bg-white p-4 rounded-lg drop-shadow-2xl">
                <Listbox.Option
                  disabled
                  className="p-2 text-md text-left font-medium uppercase"
                >
                  Currency
                </Listbox.Option>
                {countries.map((country) => {
                  const isSelected =
                    country.isoCode === selectedCountry.isoCode;
                  return (
                    <Listbox.Option
                      key={country.isoCode}
                      value={country.isoCode}
                    >
                      {({active}) => (
                        <div
                          className={`w-36 py-2 px-3 flex justify-between items-center text-left cursor-pointer rounded
                          ${active ? 'bg-gray-200' : null}`}
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
          </>
        )}
      </Listbox>
    </div>
  );
}

export function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 10L9 12L13 8M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
        stroke="#354CF6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowIcon({isOpen}) {
  return (
    <svg
      className={`transition-transform duration-300 ${
        isOpen ? 'rotate-180' : null
      }`}
      aria-hidden="true"
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.292893 0.292893C0.683416 -0.097631 1.31658 -0.097631 1.7071 0.292893L4.99999 3.58579L8.29288 0.292893C8.6834 -0.0976311 9.31657 -0.0976311 9.70709 0.292893C10.0976 0.683417 10.0976 1.31658 9.70709 1.70711L5.7071 5.70711C5.31657 6.09763 4.68341 6.09763 4.29289 5.70711L0.292893 1.70711C-0.0976309 1.31658 -0.0976309 0.683417 0.292893 0.292893Z"
        fill="#374151"
      />
    </svg>
  );
}
