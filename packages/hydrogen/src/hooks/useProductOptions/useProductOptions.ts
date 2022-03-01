import {useCallback, useEffect, useMemo, useState} from 'react';
import {flattenConnection} from '../../utilities';
import {
  SelectedOptions,
  SellingPlanGroup,
  SellingPlan,
  SellingPlanAllocation,
  Variant,
  ProductOptionsHookValue,
} from './types';
import {getOptions, getSelectedVariant} from './helpers';
import {GraphQLConnection} from '../../types';

/**
 * The `useProductOptions` hook returns an object that enables you to keep track of the
 * selected variant and/or selling plan state, as well as callbacks for modifying the state.
 */
export function useProductOptions({
  variants: variantsConnection,
  sellingPlanGroups: sellingPlanGroupsConnection,
  initialVariantId,
}: {
  /** The product's `VariantConnection`. */
  variants?: GraphQLConnection<Variant>;
  /** The product's `SellingPlanGroups`. */
  sellingPlanGroups?: GraphQLConnection<SellingPlanGroup>; // This comes from the Product
  /** The initially selected variant. */
  initialVariantId?: Variant['id'] | null;
}): ProductOptionsHookValue {
  // The flattened variants
  const variants = useMemo(
    () => (variantsConnection ? flattenConnection(variantsConnection) : []),
    [variantsConnection]
  );

  // All the options available for a product, based on all the variants
  const options = useMemo(() => getOptions(variants), [variants]);

  /**
   * Track the selectedVariant within the hook. If `initialVariantId`
   * is passed, use that as an initial value.
   */
  const [selectedVariant, setSelectedVariant] = useState<
    Variant | undefined | null
  >(
    initialVariantId == null
      ? (initialVariantId as null | undefined)
      : variants.find((variant) => variant.id === initialVariantId)
  );

  /**
   * Track the selectedOptions within the hook. If a `initialVariantId`
   * is passed, use that to select initial options.
   */
  const [selectedOptions, setSelectedOptions] = useState(
    selectedVariant?.selectedOptions
      ? selectedVariant.selectedOptions.reduce((memo, optionSet) => {
          memo[optionSet.name] = optionSet.value;
          return memo;
        }, {} as SelectedOptions)
      : {}
  );

  /**
   * When the initialVariantId changes, we need to make sure we
   * update the selected variant and selected options. If not,
   * then the selected variant and options will reference incorrect
   * values.
   */
  useEffect(() => {
    const selectedVariant =
      initialVariantId == null
        ? (initialVariantId as null | undefined)
        : variants.find((variant) => variant.id === initialVariantId);
    setSelectedVariant(selectedVariant);

    const selectedOptions = selectedVariant?.selectedOptions
      ? selectedVariant.selectedOptions.reduce((memo, optionSet) => {
          memo[optionSet.name] = optionSet.value;
          return memo;
        }, {} as SelectedOptions)
      : {};
    setSelectedOptions(selectedOptions);
  }, [initialVariantId, variants]);

  /**
   * Allow the developer to select an option.
   */
  const setSelectedOption = useCallback(
    (name: string, value: string) => {
      const newSelectedOptions = {
        ...selectedOptions,
        [name]: value,
      };

      setSelectedOptions(newSelectedOptions);
    },
    [selectedOptions]
  );

  useEffect(() => {
    /**
     * When selected options change, select the correct variant.
     */
    const variant = getSelectedVariant(variants, selectedOptions);

    if (variant) {
      setSelectedVariant(variant);
    }
  }, [variants, selectedOptions]);

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
      (allocation) => allocation.sellingPlan.id === selectedSellingPlan.id
    );
  }, [selectedVariant, selectedSellingPlan]);

  return {
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
    sellingPlanGroups,
    sellingPlanGroupsConnection,
  };
}
