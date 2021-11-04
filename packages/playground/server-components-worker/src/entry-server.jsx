import App from './App.server';
import renderHydrogen from '@shopify/hydrogen/entry-server';

export default renderHydrogen(App, ({url}) => {
  // Custom hook
});
