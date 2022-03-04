<!-- This file is generated from source code in the Shopify/hydrogen repo. Edit the files in /packages/hydrogen/src/hooks/useAvailableCountries and run 'yarn generate-docs' at the root of this repo. For more information, refer to https://github.com/Shopify/shopify-dev/blob/main/content/internal/operations/hydrogen-reference-docs.md. -->

The `useAvailableCountries` hook returns an array of available countries used for localization.
It must be a descendent of a `LocalizationProvider` component.

## Example code

```tsx
import {useAvailableCountries, useCountry} from '@shopify/hydrogen';

export function CountrySelector() {
  const countries = useAvailableCountries();
  const [_, setCountry] = useCountry();

  return (
    <select name="country" onChange={(event) => setCountry(event.target.value)}>
      {countries.map((country) => {
        return (
          <option key={country.isoCode} value={country.isoCode}>
            {country.name}
          </option>
        );
      })}
    </select>
  );
}
```

## Return value

An array of country objects with `isoCode` and `name` keys.

## Related components

- [`LocalizationProvider`](/api/hydrogen/components/localization/localizationprovider)

## Related hooks

- [`useCountry`](/api/hydrogen/hooks/localization/usecountry)
