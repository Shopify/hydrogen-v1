import {useCallback, useState, Suspense} from 'react';
import {useCountry} from '@shopify/hydrogen';
import {Listbox} from '@headlessui/react';
import SpinnerIcon from './SpinnerIcon.client';

import {ArrowIcon, Countries} from './CountrySelector.client';

/**
 * A client component that selects the appropriate country to display for products on a mobile storefront
 */
export default function MobileCountrySelector() {
  const [listboxOpen, setListboxOpen] = useState(false);
  const [selectedCountry] = useCountry();

  const setCountry = useCallback(({isoCode, name}) => {
    fetch(`/countries`, {
      body: JSON.stringify({isoCode, name}),
      method: 'POST',
    }).then(() => {
      window.location.reload();
    });
  }, []);

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
                {listboxOpen && (
                  <Suspense
                    fallback={
                      <div className="flex justify-center">
                        <SpinnerIcon />
                      </div>
                    }
                  >
                    <Countries
                      selectedCountry={selectedCountry}
                      getClassName={(active) => {
                        return (
                          `py-2 px-4 rounded flex justify-between items-center text-left w-full cursor-pointer` +
                          `${active ? ' bg-gray-100' : ''}`
                        );
                      }}
                    />
                  </Suspense>
                )}
              </Listbox.Options>
            </>
          );
        }}
      </Listbox>
    </div>
  );
}
