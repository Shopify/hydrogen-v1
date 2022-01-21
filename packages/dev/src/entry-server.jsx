import renderHydrogen from '@shopify/hydrogen/entry-server';
import shopifyConfig from '../shopify.config';

import App from './App.server';

const pages = import.meta.globEager('./pages/**/*.server.[jt](s|sx)');

export default renderHydrogen(App, {shopifyConfig, pages});
