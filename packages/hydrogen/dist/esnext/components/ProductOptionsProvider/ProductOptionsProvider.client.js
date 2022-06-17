import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { ProductOptionsContext } from './context';
import { getSelectedVariant, getOptions, } from '../../hooks/useProductOptions/helpers';
import { flattenConnection } from '../../utilities/flattenConnection';
export function ProductOptionsProvider({ children, data: product, initialVariantId: explicitVariantId, }) {
    // The flattened variants
    const variants = useMemo(() => flattenConnection(product.variants ?? {}), [product.variants]);
    if (!isProductVariantArray(variants)) {
        throw new Error(`<ProductOptionsProvider/> requires 'product.variants.nodes' or 'product.variants.edges'`);
    }
    // All the options available for a product, based on all the variants
    const options = useMemo(() => getOptions(variants), [variants]);
    /**
     * Track the selectedVariant within the provider.
     */
    const [selectedVariant, setSelectedVariant] = useState(() => getVariantBasedOnIdProp(explicitVariantId, variants));
    /**
     * Track the selectedOptions within the provider. If a `initialVariantId`
     * is passed, use that to select initial options.
     */
    const [selectedOptions, setSelectedOptions] = useState(() => getSelectedOptions(selectedVariant));
    /**
     * When the initialVariantId changes, we need to make sure we
     * update the selected variant and selected options. If not,
     * then the selected variant and options will reference incorrect
     * values.
     */
    useEffect(() => {
        const newSelectedVariant = getVariantBasedOnIdProp(explicitVariantId, variants);
        setSelectedVariant(newSelectedVariant);
        setSelectedOptions(getSelectedOptions(newSelectedVariant));
    }, [explicitVariantId, variants]);
    /**
     * Allow the developer to select an option.
     */
    const setSelectedOption = useCallback((name, value) => {
        setSelectedOptions((selectedOptions) => {
            const opts = { ...selectedOptions, [name]: value };
            setSelectedVariant(getSelectedVariant(variants, opts));
            return opts;
        });
    }, [setSelectedOptions, variants]);
    const isOptionInStock = useCallback((option, value) => {
        const proposedVariant = getSelectedVariant(variants, {
            ...selectedOptions,
            ...{ [option]: value },
        });
        return proposedVariant?.availableForSale ?? true;
    }, [selectedOptions, variants]);
    const sellingPlanGroups = useMemo(() => flattenConnection(product.sellingPlanGroups ?? {}).map((sellingPlanGroup) => ({
        ...sellingPlanGroup,
        sellingPlans: flattenConnection(sellingPlanGroup?.sellingPlans ?? {}),
    })), [product.sellingPlanGroups]);
    /**
     * Track the selectedSellingPlan within the hook. If `initialSellingPlanId`
     * is passed, use that as an initial value. Look it up from the `selectedVariant`, since
     * that is also a requirement.
     */
    const [selectedSellingPlan, setSelectedSellingPlan] = useState(undefined);
    const selectedSellingPlanAllocation = useMemo(() => {
        if (!selectedVariant || !selectedSellingPlan) {
            return;
        }
        if (!selectedVariant.sellingPlanAllocations?.nodes &&
            !selectedVariant.sellingPlanAllocations?.edges) {
            throw new Error(`<ProductOptionsProvider/>: You must include 'sellingPlanAllocations.nodes' or 'sellingPlanAllocations.edges' in your variants in order to calculate selectedSellingPlanAllocation`);
        }
        return flattenConnection(selectedVariant.sellingPlanAllocations).find((allocation) => allocation?.sellingPlan?.id === selectedSellingPlan.id);
    }, [selectedVariant, selectedSellingPlan]);
    const value = useMemo(() => ({
        variants,
        variantsConnection: product.variants,
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
        sellingPlanGroupsConnection: product.sellingPlanGroups,
    }), [
        isOptionInStock,
        options,
        product.sellingPlanGroups,
        product.variants,
        selectedOptions,
        selectedSellingPlan,
        selectedSellingPlanAllocation,
        selectedVariant,
        sellingPlanGroups,
        setSelectedOption,
        variants,
    ]);
    return (React.createElement(ProductOptionsContext.Provider, { value: value }, children));
}
function getVariantBasedOnIdProp(explicitVariantId, variants) {
    // get the initial variant based on the logic outlined in the comments for 'initialVariantId' above
    // * 1. If `initialVariantId` is provided, then it's used even if it's out of stock.
    if (explicitVariantId) {
        const foundVariant = variants.find((variant) => variant?.id === explicitVariantId);
        if (!foundVariant) {
            console.warn(`<ProductOptionsProvider/> received a 'initialVariantId' prop, but could not actually find a variant with that ID`);
        }
        return foundVariant;
    }
    // * 2. If `initialVariantId` is provided but is `null`, then no variant is used.
    if (explicitVariantId === null) {
        return null;
    }
    // * 3. If nothing is passed to `initialVariantId` then the first available / in-stock variant is used.
    // * 4. If nothing is passed to `initialVariantId` and no variants are in stock, then the first variant is used.
    if (explicitVariantId === undefined) {
        return variants.find((variant) => variant?.availableForSale) || variants[0];
    }
}
function getSelectedOptions(selectedVariant) {
    return selectedVariant?.selectedOptions
        ? selectedVariant.selectedOptions.reduce((memo, optionSet) => {
            memo[optionSet?.name ?? ''] = optionSet?.value ?? '';
            return memo;
        }, {})
        : {};
}
function isProductVariantArray(maybeVariantArray) {
    if (!maybeVariantArray || !Array.isArray(maybeVariantArray)) {
        return false;
    }
    return true;
}
