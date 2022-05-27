import {useState, Suspense} from 'react';
import {useCountry, fetchSync} from '@shopify/hydrogen';
import {Listbox} from '@headlessui/react';
import Icon from '~/components/elements/Icon';

/**
 * A client component that selects the appropriate country to display for products on a website
 */
export default function CountrySelector() {
  const [listboxOpen, setListboxOpen] = useState(false);

  const [selectedCountry, setSelectedCountry] = useCountry();

  return (
    <div className="relative">
      <Listbox onChange={setSelectedCountry}>
        {({open}) => {
          setTimeout(() => setListboxOpen(open));
          return (
            <>
              <Listbox.Button className="flex items-center justify-between w-full">
                <span className="">{selectedCountry.name}</span>
                <Icon
                  type="chevron-down"
                  className={`w-5 h-5 transition-transform duration-300 ${
                    open ? 'rotate-180' : null
                  }`}
                />
              </Listbox.Button>

              <Listbox.Options className="">
                <div className="">
                  <Listbox.Option disabled className="">
                    Country
                  </Listbox.Option>
                  {listboxOpen && (
                    <Suspense fallback={<div>Loading…</div>}>
                      <Countries
                        selectedCountry={selectedCountry}
                        getClassName={(active) => {
                          return (
                            `w-36 py-2 px-3 flex justify-between items-center text-left cursor-pointer` +
                            `rounded ${active ? 'bg-gray-200' : null}`
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
  // TODO: We should have this handled inside this component, no?
  const countries = fetchSync('/api/countries').json();

  return countries.map((country) => {
    const isSelected = country.isoCode === selectedCountry.isoCode;
    return (
      <Listbox.Option key={country.isoCode} value={country}>
        {({active}) => (
          <div className={getClassName(active)}>
            {country.name}
            {isSelected ? <CheckIcon /> : null}
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
        stroke="#354CF6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
