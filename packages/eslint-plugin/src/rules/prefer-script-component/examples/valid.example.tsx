// Examples of **correct** code for this rule:

import {Script} from '@shopify/hydrogen';

function MyComponent() {
  return (
    // eslint-disable-next-line hydrogen/scripts-in-layout-components
    <Script
      id="gtm"
      load="inWorker"
      src="https://www.googletagmanager.com/gtm.js"
    />
  );
}
