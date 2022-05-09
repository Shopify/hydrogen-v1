---
'@shopify/hydrogen': minor
'create-hydrogen-app': minor
---

The selected country is now persisted a part of the session. This means that the page can be refreshed and the country will still be selected. There are a few breaking changes:

1. `useCountry()` hook now only returns the currently selected country. The `setCountry()` method has been removed.
2. The `useCountry()` hook expects a `countryCode` and `countryName` to be a part of the user session.
3. The example `/countries` API route has been updated to accept a `POST` request to update the selected country. The CountrySelector components need to be updated to use that route.

```diff
// src/routes/countries.server.jsx

-export async function api(request, {queryShop}) {
+export async function api(request, {queryShop, session}) {
+  if (request.method === 'POST') {
+    const {isoCode, name} = await request.json();
+
+    await session.set('countryCode', isoCode);
+    await session.set('countryName', name);
+
+    return 'success';
+  }

   const {
     data: {
       localization: {availableCountries},
     },
   } = await queryShop({
      query: QUERY,
   });
   return availableCountries.sort((a, b) => a.name.localeCompare(b.name));
}
```

```diff
// src/components/CountrySelector.client.jsx

export default function CountrySelector() {
  const [listboxOpen, setListboxOpen] = useState(false);

- const [selectedCountry, setSelectedCountry] = useCountry();
+ const [selectedCountry] = useCountry();

+ const setSelectedCountry = useCallback(
+   ({isoCode, name}) => {
+     fetch(`/countries`, {
+       body: JSON.stringify({isoCode, name}),
+       method: 'POST',
+     })
+       .then(() => {
+         window.location.reload();
+       })
+       .catch((error) => {
+         console.error(error);
+       });
+   },
+   [],
+ );

  return (
      ...
  );
}
```

4. Each server component page that depends on the selected country pulls it from the session with `useSession()`, rather than `serverProps`.

```diff
// src/routes/products/[handle].server.jsx
+ import { useSession } from '@shopify/hydrogen';

- export default function Product({country = {isoCode: 'US'}}) {
+ export default function Product() {
    const {handle} = useRouteParams();
+   const {countryCode = 'US'} = useSession();
    ...
  }
```
