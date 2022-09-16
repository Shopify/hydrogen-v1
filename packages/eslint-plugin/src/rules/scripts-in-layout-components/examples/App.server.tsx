// Examples of **correct** code for this rule:

import {Script} from '@shopify/hydrogen';

// file App.server.tsx
function App() {
  return (
    <Script
      id="gtm"
      load="inWorker"
      src="https://www.googletagmanager.com/gtm.js"
    />
  );
}
