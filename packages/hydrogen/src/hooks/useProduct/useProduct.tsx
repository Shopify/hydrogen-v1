import {useContext} from 'react';
import {ProductContext} from '../../components/ProductProvider/context';

/**
 * The `useProduct` hook returns the product object of the nearest `ProductProvider`. It must be a descendent of
 * a `ProductProvider` component.
 */
export function useProduct() {
  const context = useContext(ProductContext);

  return context;
}
