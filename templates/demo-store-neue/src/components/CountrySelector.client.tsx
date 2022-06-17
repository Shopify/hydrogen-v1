import {useCallback, useState, Suspense} from 'react';
import {useCountry, fetchSync} from '@shopify/hydrogen';
// TODO: Figure out how to properly import headless UI
import {Listbox} from '@headlessui/react';

import {IconCheck, IconCaret} from '~/components';
import {Country} from '@shopify/hydrogen/storefront-api-types';

/**
 * A client component that selects the appropriate country to display for products on a website
 */
export function CountrySelector() {
  const [listboxOpen, setListboxOpen] = useState(false);
  const [selectedCountry] = useCountry();

  const setCountry = useCallback(
    ({isoCode, name}: {isoCode: string; name: string}) => {
      fetch(`/api/countries`, {
        body: JSON.stringify({isoCode, name}),
        method: 'POST',
      }).then(() => {
        window.location.reload();
      });
    },
    [],
  );

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
                } border-contrast/30 dark:border-white`}
              >
                <span className="">{selectedCountry!.name}</span>
                <IconCaret direction={open ? 'up' : 'down'} />
              </Listbox.Button>

              <Listbox.Options
                className={`border-t-contrast/30 border-contrast/30 absolute bottom-12 z-10 grid h-48 w-full overflow-y-scroll rounded-t border dark:border-white px-2 py-2 transition-[max-height] duration-150 sm:bottom-auto md:rounded-b md:rounded-t-none md:border-t-0 md:border-b
              ${listboxOpen ? 'max-h-48' : 'max-h-0'}`}
              >
                {listboxOpen && (
                  <Suspense fallback={<div className="p-2">Loading…</div>}>
                    <Countries
                      selectedCountry={selectedCountry!}
                      getClassName={(active) => {
                        return `text-white w-full p-2 transition rounded flex justify-start items-center text-left cursor-pointer ${
                          active ? 'bg-contrast/10' : null
                        }`;
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

export function Countries({
  selectedCountry,
  getClassName,
}: {
  selectedCountry: Pick<Country, 'isoCode' | 'name'>;
  getClassName: (active: boolean) => string;
}) {
  const countries: Country[] = fetchSync('/api/countries').json();

  return (countries || []).map((country) => {
    const isSelected = country.isoCode === selectedCountry.isoCode;

    return (
      <Listbox.Option key={country.isoCode} value={country}>
        {({active}) => (
          <div className={`text-primary ${getClassName(active)}`}>
            {country.name}
            {isSelected ? (
              <span className="ml-2">
                <IconCheck />
              </span>
            ) : null}
          </div>
        )}
      </Listbox.Option>
    );
  });
}
