import App from './App.server';
import renderHydrogen from '@shopify/hydrogen/entry-server';
import {setLogger} from '@shopify/hydrogen';

setLogger({
  trace() {},
  debug() {},
  warn(context, ...args) {
    console.warn(...args);
  },
  error(context, ...args) {
    console.error(...args);
  },
  fatal(context, ...args) {
    console.error(...args);
  },
});

const pages = import.meta.globEager('./pages/**/*.server.[jt](s|sx)');

export default renderHydrogen(App, {pages});
