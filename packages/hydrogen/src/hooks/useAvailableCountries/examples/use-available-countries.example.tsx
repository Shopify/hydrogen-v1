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
