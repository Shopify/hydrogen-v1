import renderHydrogen from '@shopify/hydrogen/entry-server';

import App from './App.server';

export default renderHydrogen(App, () => {
  // Custom hook
});
