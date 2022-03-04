export default function () {
  return `
import renderHydrogen from '@shopify/hydrogen/entry-server';
import App from './App.server';

const routes = import.meta.globEager('./routes/**/*.server.[jt](s|sx)');

export default renderHydrogen(App, {routes});

`;
}
