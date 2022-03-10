import {Listbox} from '@headlessui/react';
import {CheckIcon} from './CountrySelector.client';

export default function CountrySelectorAvailableCountry({
  countries,
  selectedCountry,
}) {
  return (
    <Listbox.Options className="absolute z-10 mt-2">
      <div className="bg-white p-4 rounded-lg drop-shadow-2xl overflow-y-auto h-64">
        <Listbox.Option
          disabled
          className="p-2 text-md text-left font-medium uppercase"
        >
          Country
        </Listbox.Option>
        {countries.map((country) => {
          const isSelected = country.isoCode === selectedCountry.isoCode;
          return (
            <Listbox.Option key={country.isoCode} value={country.isoCode}>
              {({active}) => (
                <div
                  className={`w-36 py-2 px-3 flex justify-between items-center text-left cursor-pointer rounded
                ${active ? 'bg-gray-200' : null}`}
                >
                  {country.name}
                  {isSelected ? <CheckIcon /> : null}
                </div>
              )}
            </Listbox.Option>
          );
        })}
      </div>
    </Listbox.Options>
  );
}
