import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react';
import type {
  SelectedOption as SelectedOptionType,
  SellingPlan,
  SellingPlanAllocation,
  Product,
  ProductVariant as ProductVariantType,
  ProductVariantConnection,
  SellingPlan as SellingPlanType,
  SellingPlanAllocation as SellingPlanAllocationType,
  SellingPlanGroup as SellingPlanGroupType,
  SellingPlanGroupConnection,
} from './storefront-api-types.js';
import type {PartialDeep} from 'type-fest';
import {flattenConnection} from './flatten-connection.js';

const ProductOptionsContext = createContext<ProductOptionsHookValue | null>(
  null
);

type InitialVariantId = ProductVariantType['id'] | null;

interface ProductOptionsProviderProps {
  /** A [Product object](https://shopify.dev/api/storefront/reference/products/product). */
  data: PartialDeep<Product>;
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

/**
 * `<ProductOptionsProvider />` is a context provider that enables use of the `useProductOptions()` hook.
 *
 * It helps manage selected options and variants for a product.
 */
export function ProductOptionsProvider({
  children,
  data: product,
  initialVariantId: explicitVariantId,
}: ProductOptionsProviderProps) {
  // The flattened variants
  const variants = useMemo(
    () => flattenConnection(product.variants ?? {}),
    [product.variants]
  );

  if (!isProductVariantArray(variants)) {
    throw new Error(
      `<ProductOptionsProvider/> requires 'product.variants.nodes' or 'product.variants.edges'`
    );
  }

  // All the options available for a product, based on all the variants
  const options = useMemo(() => getOptions(variants), [variants]);

  /**
   * Track the selectedVariant within the provider.
   */
  const [selectedVariant, setSelectedVariant] = useState<
    PartialDeep<ProductVariantType> | undefined | null
  >(() => getVariantBasedOnIdProp(explicitVariantId, variants));

  /**
   * Track the selectedOptions within the provider. If a `initialVariantId`
   * is passed, use that to select initial options.
   */
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(() =>
    getSelectedOptions(selectedVariant)
  );

  /**
   * When the initialVariantId changes, we need to make sure we
   * update the selected variant and selected options. If not,
   * then the selected variant and options will reference incorrect
   * values.
   */
  useEffect(() => {
    const newSelectedVariant = getVariantBasedOnIdProp(
      explicitVariantId,
      variants
    );
    setSelectedVariant(newSelectedVariant);
    setSelectedOptions(getSelectedOptions(newSelectedVariant));
  }, [explicitVariantId, variants]);

  /**
   * Allow the developer to select an option.
   */
  const setSelectedOption = useCallback(
    (name: string, value: string) => {
      setSelectedOptions((selectedOptions) => {
        const opts = {...selectedOptions, [name]: value};
        setSelectedVariant(getSelectedVariant(variants, opts));
        return opts;
      });
    },
    [setSelectedOptions, variants]
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
      flattenConnection(product.sellingPlanGroups ?? {}).map(
        (sellingPlanGroup) => ({
          ...sellingPlanGroup,
          sellingPlans: flattenConnection(sellingPlanGroup?.sellingPlans ?? {}),
        })
      ),
    [product.sellingPlanGroups]
  );

  /**
   * Track the selectedSellingPlan within the hook. If `initialSellingPlanId`
   * is passed, use that as an initial value. Look it up from the `selectedVariant`, since
   * that is also a requirement.
   */
  const [selectedSellingPlan, setSelectedSellingPlan] = useState<
    PartialDeep<SellingPlan> | undefined
  >(undefined);

  const selectedSellingPlanAllocation = useMemo<
    PartialDeep<SellingPlanAllocation> | undefined
  >(() => {
    if (!selectedVariant || !selectedSellingPlan) {
      return;
    }

    if (
      !selectedVariant.sellingPlanAllocations?.nodes &&
      !selectedVariant.sellingPlanAllocations?.edges
    ) {
      throw new Error(
        `<ProductOptionsProvider/>: You must include 'sellingPlanAllocations.nodes' or 'sellingPlanAllocations.edges' in your variants in order to calculate selectedSellingPlanAllocation`
      );
    }

    return flattenConnection(selectedVariant.sellingPlanAllocations).find(
      (allocation) => allocation?.sellingPlan?.id === selectedSellingPlan.id
    );
  }, [selectedVariant, selectedSellingPlan]);

  const value = useMemo<ProductOptionsHookValue>(
    () => ({
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
    }),
    [
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
    ]
  );

  return (
    <ProductOptionsContext.Provider value={value}>
      {children}
    </ProductOptionsContext.Provider>
  );
}

/**
 * Provides access to the context value provided by `<ProductOptionsProvider />`. Must be a descendent of `<ProductOptionsProvider />`.
 */
export function useProductOptions() {
  const context = useContext(ProductOptionsContext);

  if (!context) {
    throw new Error(
      `'useProductOptions' must be a child of <ProductOptionsProvider />`
    );
  }

  return context;
}

function getSelectedVariant(
  variants: PartialDeep<ProductVariantType>[],
  choices: SelectedOptions
): PartialDeep<ProductVariantType> | undefined {
  /**
   * Ensure the user has selected all the required options, not just some.
   */
  if (
    !variants.length ||
    variants?.[0]?.selectedOptions?.length !== Object.keys(choices).length
  ) {
    return;
  }

  return variants?.find((variant) => {
    return Object.entries(choices).every(([name, value]) => {
      return variant?.selectedOptions?.some(
        (option) => option?.name === name && option?.value === value
      );
    });
  });
}

function getOptions(
  variants: PartialDeep<ProductVariantType>[]
): OptionWithValues[] {
  const map = variants.reduce((memo, variant) => {
    if (!variant.selectedOptions) {
      throw new Error(`'getOptions' requires 'variant.selectedOptions'`);
    }
    variant?.selectedOptions?.forEach((opt) => {
      memo[opt?.name ?? ''] = memo[opt?.name ?? ''] || new Set();
      memo[opt?.name ?? ''].add(opt?.value ?? '');
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

function getVariantBasedOnIdProp(
  explicitVariantId: InitialVariantId | undefined,
  variants: Array<PartialDeep<ProductVariantType> | undefined>
) {
  // get the initial variant based on the logic outlined in the comments for 'initialVariantId' above
  // * 1. If `initialVariantId` is provided, then it's used even if it's out of stock.
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

function getSelectedOptions(
  selectedVariant: PartialDeep<ProductVariantType> | undefined | null
): SelectedOptions {
  return selectedVariant?.selectedOptions
    ? selectedVariant.selectedOptions.reduce<SelectedOptions>(
        (memo, optionSet) => {
          memo[optionSet?.name ?? ''] = optionSet?.value ?? '';
          return memo;
        },
        {}
      )
    : {};
}

function isProductVariantArray(
  maybeVariantArray: (PartialDeep<ProductVariantType> | undefined)[] | undefined
): maybeVariantArray is PartialDeep<ProductVariantType>[] {
  if (!maybeVariantArray || !Array.isArray(maybeVariantArray)) {
    return false;
  }

  return true;
}

export interface OptionWithValues {
  name: SelectedOptionType['name'];
  values: SelectedOptionType['value'][];
}

type ProductOptionsHookValue = PartialDeep<{
  /** An array of the variant `nodes` from the `VariantConnection`. */
  variants: ProductVariantType[];
  variantsConnection?: ProductVariantConnection;
  /** An array of the product's options and values. */
  options: OptionWithValues[];
  /** The selected variant. */
  selectedVariant?: ProductVariantType | null;
  selectedOptions: SelectedOptions;
  /** The selected selling plan. */
  selectedSellingPlan?: SellingPlanType;
  /** The selected selling plan allocation. */
  selectedSellingPlanAllocation?: SellingPlanAllocationType;
  /** The selling plan groups. */
  sellingPlanGroups?: (Omit<SellingPlanGroupType, 'sellingPlans'> & {
    sellingPlans: SellingPlanType[];
  })[];
  sellingPlanGroupsConnection?: SellingPlanGroupConnection;
}> & {
  /** A callback to set the selected variant to the variant passed as an argument. */
  setSelectedVariant: SelectVariantCallback;
  /** A callback to set the selected option. */
  setSelectedOption: SelectOptionCallback;
  /** A callback to set multiple selected options at once. */
  setSelectedOptions: SelectOptionsCallback;
  /** A callback to set the selected selling plan to the one passed as an argument. */
  setSelectedSellingPlan: SelectedSellingPlanCallback;
  /** A callback that returns a boolean indicating if the option is in stock. */
  isOptionInStock: OptionsInStockCallback;
};

export type SelectVariantCallback = (
  variant: PartialDeep<ProductVariantType> | null
) => void;

export type SelectOptionCallback = (
  name: SelectedOptionType['name'],
  value: SelectedOptionType['value']
) => void;

export type SelectOptionsCallback = (options: SelectedOptions) => void;

export type OptionsInStockCallback = (
  name: SelectedOptionType['name'],
  value: SelectedOptionType['value']
) => boolean;

export type SelectedSellingPlanCallback = (
  sellingPlan: SellingPlanType
) => void;

export type SelectedOptions = {
  [key: string]: string;
};
