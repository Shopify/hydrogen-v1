export function getAllOptionValues(variants, option) {
    return Array.from(new Set(variants.map((variant) => variant.selectedOptions.find((selection) => selection.name == option)
        .value)));
}
export function getSelectedVariant(variants, choices) {
    /**
     * Ensure the user has selected all the required options, not just some.
     */
    if (!variants.length ||
        variants?.[0]?.selectedOptions?.length !== Object.keys(choices).length) {
        return;
    }
    return variants?.find((variant) => {
        return Object.entries(choices).every(([name, value]) => {
            return variant?.selectedOptions?.some((option) => option?.name === name && option?.value === value);
        });
    });
}
export function getOptions(variants) {
    const map = variants.reduce((memo, variant) => {
        if (!variant.selectedOptions) {
            throw new Error(`getOptions requires 'variant.selectedOptions`);
        }
        variant?.selectedOptions?.forEach((opt) => {
            memo[opt?.name ?? ''] = memo[opt?.name ?? ''] || new Set();
            memo[opt?.name ?? ''].add(opt?.value ?? '');
        });
        return memo;
    }, {});
    return Object.keys(map).map((option) => {
        return {
            name: option,
            values: Array.from(map[option]),
        };
    });
}
