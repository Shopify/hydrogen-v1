// Examples of **incorrect** code for this rule:

import {Script} from '@shopify/hydrogen';

// file products/[handle].server.tsx
function MyComponent() {
  return (
    // eslint-disable-next-line hydrogen/scripts-in-layout-components
    <Script load="inWorker" src="https://www.googletagmanager.com/gtm.js" />
  );
}

// file /contact.server.tsx
function MyContactComponent() {
  return (
    // eslint-disable-next-line hydrogen/scripts-in-layout-components
    <Script
      load="beforeHydration"
      src="https://www.googletagmanager.com/ga.js"
    />
  );
}
