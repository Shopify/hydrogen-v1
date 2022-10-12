# Ensure that `<Script load="beforeHydration | inWorker" />` tags are only allowed in App.server.tsx

Scripts with these loading strategies are run only on the first render. If a Script is placed on a route component, then it will only be loaded if the user first navigates to that particular route.

## Rule details

This rule prevents using the `Script` tag with "beforeHydration" or "inWorker" loading strategies on files other than App.server.tsx to ensure the scripts run in any initial route.

### Incorrect code

```tsx
import {Script} from '@shopify/hydrogen';

// file products/[handle].server.tsx
function MyProductComponent() {
  return (
    <Script load="inWorker" src="https://www.googletagmanager.com/gtm.js" />
  );
}

// file /contact.server.tsx
function MyContactComponent() {
  return (
    <Script
      load="beforeHydration"
      src="https://www.googletagmanager.com/ga.js"
    />
  );
}
```

### Correct code

```tsx
// file App.server.tsx
import {Script} from '@shopify/hydrogen';

function App() {
  return (
    <>
      <Script
        id="gtm"
        load="inWorker"
        src="https://www.googletagmanager.com/gtm.js"
      />
      <Script
        id="ga"
        load="beforeHydration"
        src="https://www.googletagmanager.com/ga.js"
      />
    </>
  );
}
```
