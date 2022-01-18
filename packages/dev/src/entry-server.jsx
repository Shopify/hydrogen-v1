import renderHydrogen from '@shopify/hydrogen/entry-server';

import App from './App.server';

const pages = import.meta.globEager('./pages/**/*.server.[jt]sx');

export default renderHydrogen(App, {pages}, () => {
  // Custom hook
});
