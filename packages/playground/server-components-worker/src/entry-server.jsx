import App from './App.server';
import renderHydrogen from '@shopify/hydrogen/entry-server';
import {setLogger} from '@shopify/hydrogen';
const pages = import.meta.globEager('./pages/**/*.server.[jt]sx');

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

export default renderHydrogen(App, {pages}, ({url}) => {
  // Custom hook
});
