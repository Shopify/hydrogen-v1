import {useContext} from 'react';
import {
  ProductContext,
  ProductOptionsContext,
} from '../../components/ProductProvider/context';
import {ProductOptionsHookValue} from '../useProductOptions';

/**
 * The `useProduct` hook returns the product object of the nearest `ProductProvider`. It must be a descendent of
 * a `ProductProvider` component.
 */
export function useProduct() {
  const data = useContext(ProductContext);
  let state: ProductOptionsHookValue | ProductOptionsContextFallback;
  try {
    state = useContext(ProductOptionsContext) ?? {...stateFallback};
  } catch (error) {
    // for server components which can't use state
    state = {...stateFallback};
  }

  return {
    ...state,
    ...data,
  };
}

type ProductOptionsContextFallback = Partial<ProductOptionsHookValue>;

const stateFallback: ProductOptionsContextFallback = {
  variants: undefined,
  variantsConnection: undefined,
  options: undefined,
  selectedVariant: undefined,
  setSelectedVariant: NotAvailable('setSelectedVariant'),
  selectedOptions: undefined,
  setSelectedOption: NotAvailable('setSelectedOption'),
  setSelectedOptions: NotAvailable('setSelectedOptions'),
  isOptionInStock: undefined,
  setSelectedSellingPlan: NotAvailable('setSelectedSellingPlan'),
  selectedSellingPlan: undefined,
  selectedSellingPlanAllocation: undefined,
  sellingPlanGroups: undefined,
  sellingPlanGroupsConnection: undefined,
};

function NotAvailable(propName: keyof ProductOptionsHookValue) {
  return () => {
    throw new Error(
      `The '${propName}' function is not available in server components`
    );
  };
}
