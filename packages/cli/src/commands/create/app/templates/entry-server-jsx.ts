export default function () {
  return `
import renderHydrogen from '@shopify/hydrogen/entry-server';

import App from './App.server';

export default renderHydrogen(App, ({url}) => {
  // Custom hook
});
`;
}
