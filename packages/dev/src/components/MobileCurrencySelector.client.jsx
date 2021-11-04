import {useCallback} from 'react';
import {useAvailableCountries, useCountry} from '@shopify/hydrogen/client';
import {Listbox} from '@headlessui/react';

export default function MobileCurrencySelector() {
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
    <div className="mt-8 border-2 border-black w-full">
      <Listbox onChange={setCountry}>
        {({open}) => (
          <>
            <Listbox.Button className="w-full flex justify-between items-center py-5 px-7">
              {selectedCountry.currency.isoCode}
              {open ? <MinusIcon /> : <PlusIcon />}
            </Listbox.Button>
            <Listbox.Options className="w-full px-7 pb-2">
              <Listbox.Option
                disabled
                className="font-bold p-2 w-full text-left border-t-4 border-blue-600"
              >
                Currency
              </Listbox.Option>
              {countries.map((country) => {
                const isSelected = country.isoCode === selectedCountry.isoCode;
                return (
                  <Listbox.Option key={country.isoCode} value={country.isoCode}>
                    {({active}) => (
                      <div
                        className={`p-2 flex justify-between items-center text-left w-full cursor-pointer border-t border-gray-200 ${
                          isSelected ? 'font-medium' : null
                        } ${active ? 'bg-gray-100' : null}`}
                      >
                        {country.currency.isoCode}
                        {isSelected ? <CheckIcon /> : null}
                      </div>
                    )}
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </>
        )}
      </Listbox>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 0C5.55228 0 6 0.447715 6 1V4L9 4C9.55228 4 10 4.44772 10 5C10 5.55228 9.55228 6 9 6H6V9C6 9.55229 5.55228 10 5 10C4.44771 10 4 9.55229 4 9V6H1C0.447715 6 0 5.55228 0 5C5.96046e-08 4.44771 0.447715 4 1 4L4 4V1C4 0.447715 4.44771 0 5 0Z"
        fill="#111827"
      />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      width="13"
      height="2"
      viewBox="0 0 13 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="1"
        y1="1"
        x2="12"
        y2="1"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
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
