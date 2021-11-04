import {Variant, SelectedOptions, OptionWithValues} from './types';

export function getAllOptionValues(variants: Variant[], option: string) {
  return Array.from(
    new Set(
      variants.map(
        (variant) =>
          variant.selectedOptions.find((selection) => selection.name == option)!
            .value
      )
    )
  );
}

export function getSelectedVariant(
  variants: Variant[],
  choices: SelectedOptions
): Variant | undefined {
  /**
   * Ensure the user has selected all the required options, not just some.
   */
  if (
    !variants.length ||
    variants[0].selectedOptions.length !== Object.keys(choices).length
  ) {
    return;
  }

  return variants.find((variant) => {
    return Object.entries(choices).every(([name, value]) => {
      return variant.selectedOptions.some(
        (option) => option.name === name && option.value === value
      );
    });
  });
}

export function getOptions(variants: Variant[]): OptionWithValues[] {
  const map = variants.reduce((memo, variant: Variant) => {
    variant.selectedOptions.forEach(({name, value}) => {
      memo[name] = memo[name] || new Set();
      memo[name].add(value);
    });

    return memo;
  }, {} as Record<string, Set<string>>);

  return Object.keys(map).map((option) => {
    return {
      name: option,
      values: Array.from(map[option]),
    };
  });
}
