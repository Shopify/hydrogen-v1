import type {
  SelectedOption as SelectedOptionType,
  ProductVariant as ProductVariantType,
  ProductVariantConnection,
  SellingPlan as SellingPlanType,
  SellingPlanAllocation as SellingPlanAllocationType,
  SellingPlanGroup as SellingPlanGroupType,
  SellingPlanConnection,
} from '../../storefront-api-types';

export type SelectedOptions = {
  [key: string]: string;
};

export type SelectVariantCallback = (variant: ProductVariantType) => void;

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

export interface OptionWithValues {
  name: SelectedOptionType['name'];
  values: SelectedOptionType['value'][];
}

export interface ProductOptionsHookValue {
  /** An array of the variant `nodes` from the `VariantConnection`. */
  variants: ProductVariantType[];
  variantsConnection?: ProductVariantConnection;
  /** An array of the product's options and values. */
  options: OptionWithValues[];
  /** The selected variant. */
  selectedVariant?: ProductVariantType | null;
  /** A callback to set the selected variant to the variant passed as an argument. */
  setSelectedVariant: SelectVariantCallback;
  selectedOptions: SelectedOptions;
  /** A callback to set the selected option. */
  setSelectedOption: SelectOptionCallback;
  /** A callback to set multiple selected options at once. */
  setSelectedOptions: SelectOptionsCallback;
  /** A callback that returns a boolean indicating if the option is in stock. */
  isOptionInStock: OptionsInStockCallback;
  /** A callback to set the selected selling plan to the one passed as an argument. */
  setSelectedSellingPlan: SelectedSellingPlanCallback;
  /** The selected selling plan. */
  selectedSellingPlan?: SellingPlanType;
  /** The selected selling plan allocation. */
  selectedSellingPlanAllocation?: SellingPlanAllocationType;
  /** The selling plan groups. */
  sellingPlanGroups?: (Omit<SellingPlanGroupType, 'sellingPlans'> & {
    sellingPlans: SellingPlanType[];
  })[];
  sellingPlanGroupsConnection?: SellingPlanConnection;
}
