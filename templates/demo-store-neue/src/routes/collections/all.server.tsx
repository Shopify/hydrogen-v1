/**
 * Might want to explain that this is different behavior from the online store,
 * where /collections/all is a default collection, without the redirect to /products
 * Just strikes me as a potential storefront feature-parity gotcha
 */
 

import {type HydrogenRouteProps} from '@shopify/hydrogen';

export default function Redirect({response}: HydrogenRouteProps) {
  return response.redirect('/products');
}
