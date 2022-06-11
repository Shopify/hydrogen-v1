import {useCallback, useState, Suspense} from 'react';
import {useCountry, fetchSync} from '@shopify/hydrogen';
import {Listbox} from '@headlessui/react';

import {IconChevronDown, IconCheck} from '~/components/elements';

/**
 * A client component that selects the appropriate country to display for products on a website
 */
export function CountrySelector() {
  const [listboxOpen, setListboxOpen] = useState(false);
  const [selectedCountry] = useCountry();

  const setCountry = useCallback(({isoCode, name}) => {
    fetch(`/api/countries`, {
      body: JSON.stringify({isoCode, name}),
      method: 'POST',
    }).then(() => {
      window.location.reload();
    });
  }, []);

  return (
    <div className="relative">
      <Listbox onChange={setCountry}>
        {({open}) => {
          setTimeout(() => setListboxOpen(open));
          return (
            <>
              <Listbox.Button
                className={`flex items-center justify-between w-full py-3 px-4 border ${
                  open ? 'rounded-b md:rounded-t md:rounded-b-none' : 'rounded'
                } border-contrast/30`}
              >
                <span className="">{selectedCountry.name}</span>
                <IconChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    open ? 'rotate-180' : null
                  }`}
                />
              </Listbox.Button>

              <Listbox.Options className="absolute z-10 w-full border rounded-t md:rounded-b md:rounded-t-none bottom-12 sm:bottom-auto bg-primary border-t-contrast/30 md:border-t-0 md:border-b border-contrast/30">
                <div className="grid px-2 py-2 overflow-y-auto max-h-48">
                  {listboxOpen && (
                    <Suspense fallback={<div className="p-2">Loading…</div>}>
                      <Countries
                        selectedCountry={selectedCountry}
                        getClassName={(active) => {
                          return `w-full p-2 transition rounded cursor-pointer flex justify-start items-center text-left cursor-pointer ${
                            active ? 'bg-contrast/10' : null
                          }`;
                        }}
                      />
                    </Suspense>
                  )}
                </div>
              </Listbox.Options>
            </>
          );
        }}
      </Listbox>
    </div>
  );
}

export function Countries({selectedCountry, getClassName}) {
  const countries = fetchSync('/api/countries').json();

  return (countries || []).map((country) => {
    const isSelected = country.isoCode === selectedCountry.isoCode;

    return (
      <Listbox.Option key={country.isoCode} value={country}>
        {({active}) => (
          <div className={getClassName(active)}>
            {country.name}
            {isSelected ? (
              <span className="ml-2">
                <IconCheck fill="transparent" />
              </span>
            ) : null}
          </div>
        )}
      </Listbox.Option>
    );
  });
}
