---
'@shopify/hydrogen': minor
'create-hydrogen-app': minor
---

Change the country selector to lazy load available countries. The motivation to do so is that a _lot_ of countries come with the starter template. The problem is 1) the graphql query to fetch them all is relatively slow and 2) all of them get serialized to the browser in each RSC response.

This change removes `availableCountries` from the `LocalizationProvider`. As a result, the `useAvailableCountries` hook is also gone. Instead, the available countries are loaded on demand from an API route.

Migratation steps:

Create an API route to retrieve available countries:

```jsx
import {CacheDays} from '@shopify/hydrogen';

export async function api(request, {queryShop}) {
  const {
    data: {
      localization: {availableCountries},
    },
  } = await queryShop({
    query: QUERY,
    cache: CacheDays(),
  });

  return availableCountries.sort((a, b) => a.name.localeCompare(b.name));
}

const QUERY = `
  query Localization {
    localization {
      availableCountries {
        isoCode
        name
        currency {
          isoCode
        }
      }
    }
  }
`;
```

Then within your client code, query the API route with a `useEffect` hook:

```jsx
const [countries, setCountries] = useState([]);

useEffect(() => {
  fetch('/api/countries')
    .then((resp) => resp.json())
    .then((c) => setCountries(c))
    .catch((e) => setError(e))
    .finally(() => setLoading(false));
}, []);
```

See an example on how this could be done inside the Hydrogen Example Template [country selector](https://github.com/Shopify/hydrogen/blob/v1.x-2022-07/examples/template-hydrogen-default/src/components/CountrySelector.client.jsx)
