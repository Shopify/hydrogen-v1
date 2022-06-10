import {useCallback, useState, Suspense} from 'react';
import {useCountry, fetchSync} from '@shopify/hydrogen';
import {Listbox} from '@headlessui/react';

import {IconChevronDown} from '~/components/elements';

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
              <Listbox.Button className="flex items-center justify-between w-full border border-gray-500 p-2 rounded-sm">
                <span className="">{selectedCountry.name}</span>
                <IconChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    open ? 'rotate-180' : null
                  }`}
                />
              </Listbox.Button>

              <Listbox.Options className="absolute z-10 mt-2 black border border-gray-500 p-2 w-full">
                <div className="max-h-48 overflow-y-auto">
                  {listboxOpen && (
                    <Suspense fallback={<div>Loading…</div>}>
                      <Countries
                        selectedCountry={selectedCountry}
                        getClassName={(active) => {
                          return (
                            `w-full cursor-pointer py-2 flex justify-start items-center text-left cursor-pointer` +
                            `rounded ${active ? '' : null}`
                          );
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
                <CheckIcon />
              </span>
            ) : null}
          </div>
        )}
      </Listbox.Option>
    );
  });
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
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
