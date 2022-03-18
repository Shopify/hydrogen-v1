import {useCallback, useState, useEffect} from 'react';
import {useCountry} from '@shopify/hydrogen/client';
import {Listbox} from '@headlessui/react';
import SpinnerIcon from './SpinnerIcon.client';

import {ArrowIcon, CheckIcon} from './CountrySelector.client';

/**
 * A client component that selects the appropriate country to display for products on a mobile storefront
 */
export default function MobileCountrySelector() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listboxOpen, setListboxOpen] = useState(false);
  const [countries, setCountries] = useState([]);

  if (error) {
    console.error(error);
  }

  useEffect(() => {
    if (listboxOpen && !isLoading && !countries.length) {
      fetch('/countries')
        .then((resp) => {
          if (!resp.ok) throw new Error(resp.statusText);
          else return resp.json();
        })
        .then((c) => setCountries(c))
        .catch((e) => setError(e))
        .finally(() => setLoading(false));
    }
  }, [listboxOpen, isLoading, countries.length]);
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
    <div className="mt-8 rounded border border-gray-200 w-full">
      <Listbox onChange={setCountry}>
        {({open}) => {
          setTimeout(() => setListboxOpen(open));
          return (
            <>
              <Listbox.Button className="w-full flex justify-between text-sm items-center py-5 px-7">
                {selectedCountry.name}
                <ArrowIcon isOpen={open} />
              </Listbox.Button>
              <Listbox.Options className="w-full px-3 pb-2 text-lg overflow-y-auto h-64">
                <Listbox.Option
                  disabled
                  className="font-medium px-4 pb-4 w-full text-left uppercase"
                >
                  Country
                </Listbox.Option>
                {!countries.length ? (
                  <div className="flex justify-center">
                    <SpinnerIcon />
                  </div>
                ) : null}
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
                          className={`py-2 px-4 rounded flex justify-between items-center text-left w-full cursor-pointer ${
                            active ? 'bg-gray-100' : null
                          }`}
                        >
                          {country.name}
                          {isSelected ? <CheckIcon /> : null}
                        </div>
                      )}
                    </Listbox.Option>
                  );
                })}
              </Listbox.Options>
            </>
          );
        }}
      </Listbox>
    </div>
  );
}
