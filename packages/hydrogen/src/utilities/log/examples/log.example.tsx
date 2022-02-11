import {getLogger} from '@shopify/hydrogen';

const log = getLogger();
log.debug('app started'); // Statically log some information.

export default function Product({country = {isoCode: 'US'}, log}) {
  // A log object is passed to each page component.
  // Use if you want your log to have the current request contextually included.
  log.trace('product detail page rendered');

  return <h1>Product Detail page</h1>;
}
