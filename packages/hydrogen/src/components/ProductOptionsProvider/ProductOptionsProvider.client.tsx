import React, {useMemo, useState, useEffect, useCallback} from 'react';
import {ProductOptionsContext} from './context';
import type {
  SellingPlan,
  SellingPlanAllocation,
  Product,
  ProductVariant as ProductVariantType,
} from '../../storefront-api-types';
import type {PartialDeep} from 'type-fest';
import {flattenConnection} from '../../utilities';
import {getSelectedVariant} from '../../hooks/useProductOptions/helpers';

type InitialVariantId = ProductVariantType['id'] | null;

interface ProductOptionsProviderProps {
  /** A [Product object](https://shopify.dev/api/storefront/reference/products/product). */
  product: PartialDeep<Product>;
  /** A `ReactNode` element. */
  children: React.ReactNode;
  /**
   * The initially selected variant.
   * The following logic applies to `initialVariantId`:
   * 1. If `initialVariantId` is provided, then it's used even if it's out of stock.
   * 2. If `initialVariantId` is provided but is `null`, then no variant is used.
   * 3. If nothing is passed to `initialVariantId` then the first available / in-stock variant is used.
   * 4. If nothing is passed to `initialVariantId` and no variants are in stock, then the first variant is used.
   */
  initialVariantId?: InitialVariantId;
}

export function ProductOptionsProvider({
  children,
  product,
  initialVariantId: explicitVariantId,
}: ProductOptionsProviderProps) {
  // The flattened variants
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const variants = product.variants?.nodes ?? [];

  // All the options available for a product, based on all the variants
  const options = product.options ?? [];

  /**
   * Track the selectedVariant within the hook. If `initialVariantId`
   * is passed, use that as an initial value.
   */
  const [selectedVariant, setSelectedVariant] = useState<
    PartialDeep<ProductVariantType> | undefined | null
  >(() => {
    // this code block only executes the very first time 'useState' is used.
    return getVariantBasedOnIdProp(explicitVariantId, variants);
  });

  const selectedOptions = selectedVariant?.selectedOptions ?? [];

  /**
   * When the initialVariantId changes, we need to make sure we
   * update the selected variant and selected options. If not,
   * then the selected variant and options will reference incorrect
   * values.
   */
  useEffect(() => {
    setSelectedVariant(getVariantBasedOnIdProp(explicitVariantId, variants));
  }, [explicitVariantId, variants]);

  /**
   * Allow the developer to select an option.
   */
  const setSelectedOption = useCallback(
    (name: string, value: string) => {
      setSelectedOptions((selectedOptions) => ({
        ...selectedOptions,
        [name]: value,
      }));
    },
    [setSelectedOptions]
  );

  const isOptionInStock = useCallback(
    (option: string, value: string) => {
      const proposedVariant = getSelectedVariant(variants, {
        ...selectedOptions,
        ...{[option]: value},
      });

      return proposedVariant?.availableForSale ?? true;
    },
    [selectedOptions, variants]
  );

  const sellingPlanGroups = useMemo(
    () =>
      sellingPlanGroupsConnection
        ? flattenConnection(sellingPlanGroupsConnection).map(
            (sellingPlanGroup) => ({
              ...sellingPlanGroup,
              sellingPlans: sellingPlanGroup?.sellingPlans
                ? flattenConnection(sellingPlanGroup.sellingPlans)
                : [],
            })
          )
        : [],
    [sellingPlanGroupsConnection]
  );

  /**
   * Track the selectedSellingPlan within the hook. If `initialSellingPlanId`
   * is passed, use that as an initial value. Look it up from the `selectedVariant`, since
   * that is also a requirement.
   */
  const [selectedSellingPlan, setSelectedSellingPlan] = useState<
    SellingPlan | undefined
  >(undefined);

  const selectedSellingPlanAllocation = useMemo<
    SellingPlanAllocation | undefined
    // @ts-ignore The types here are broken on main, need to come back and fix them sometime
  >(() => {
    if (!selectedVariant || !selectedSellingPlan) {
      return;
    }

    if (!selectedVariant.sellingPlanAllocations) {
      throw new Error(
        `You must include sellingPlanAllocations in your variants in order to calculate selectedSellingPlanAllocation`
      );
    }

    return flattenConnection(selectedVariant.sellingPlanAllocations).find(
      // @ts-ignore The types here are broken on main, need to come back and fix them sometime
      (allocation) => allocation.sellingPlan.id === selectedSellingPlan.id
    );
  }, [selectedVariant, selectedSellingPlan]);

  const productOptions = useMemo(
    () => ({
      variants,
      variantsConnection,
      options,
      selectedVariant,
      setSelectedVariant,
      selectedOptions,
      setSelectedOption,
      setSelectedOptions,
      isOptionInStock,
      selectedSellingPlan,
      setSelectedSellingPlan,
      selectedSellingPlanAllocation,
      // @ts-ignore The types here are broken on main, need to come back and fix them sometime
      sellingPlanGroups,
      // @ts-ignore The types here are broken on main, need to come back and fix them sometime
      sellingPlanGroupsConnection,
    }),
    [
      isOptionInStock,
      options,
      selectedOptions,
      selectedSellingPlan,
      selectedSellingPlanAllocation,
      selectedVariant,
      sellingPlanGroups,
      setSelectedOption,
      variants,
    ]
  );

  return (
    <ProductOptionsContext.Provider value={productOptions}>
      {children}
    </ProductOptionsContext.Provider>
  );
}

function getVariantBasedOnIdProp(
  explicitVariantId: InitialVariantId | undefined,
  variants: Array<PartialDeep<ProductVariantType> | undefined>
) {
  // get the initial variant based on the logic outlined in the comments for 'initialVariantId' above
  // 1.
  if (explicitVariantId) {
    const foundVariant = variants.find(
      (variant) => variant?.id === explicitVariantId
    );
    if (!foundVariant) {
      console.warn(
        `<ProductOptionsProvider/> received a 'initialVariantId' prop, but could not actually find a variant with that ID`
      );
    }
    return foundVariant;
  }
  // 2.
  if (explicitVariantId === null) {
    return null;
  }
  // 3. and 4.
  if (explicitVariantId === undefined) {
    return variants.find((variant) => variant?.availableForSale) || variants[0];
  }
}
