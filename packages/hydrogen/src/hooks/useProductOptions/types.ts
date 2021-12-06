import {GraphQLConnection, RawMetafield} from '../../types';
import {SellingPlanFragmentFragment} from './SellingPlanFragment';
import {SellingPlanGroupsFragmentFragment} from './SellingPlanGroupsFragment';
import {VariantFragmentFragment} from './VariantFragment';

// Variants can be partials, but they _must_ have the following
// fields in order to use the product options functionality:
// - id
// - selectedOptions
export type Variant = Omit<
  Partial<VariantFragmentFragment>,
  'id' | 'selectedOptions' | 'metafields' | 'sellingPlanAllocations'
> & {
  id: VariantFragmentFragment['id'];
  selectedOptions: VariantFragmentFragment['selectedOptions'];
  metafields?: GraphQLConnection<Partial<RawMetafield>>;
  sellingPlanAllocations?: GraphQLConnection<SellingPlanAllocation>;
};

export type SellingPlanGroup = Omit<
  Partial<SellingPlanGroupsFragmentFragment>,
  'options'
> & {
  options: SellingPlanGroupsFragmentFragment['options'];
};

// SellingPlans can be partials but they _must_ have an id in order
// to work with the product options functionality
export type SellingPlan = Omit<Partial<SellingPlanFragmentFragment>, 'id'> & {
  id: SellingPlanFragmentFragment['id'];
};

// SellingPlanAllocations can be partial, but their sellingPlan _must_ have an id in order
// to work with the product options functionality
export type SellingPlanAllocation = Omit<
  Partial<
    VariantFragmentFragment['sellingPlanAllocations']['edges'][0]['node']
  >,
  'sellingPlan'
> & {
  sellingPlan: Omit<Partial<SellingPlanFragmentFragment>, 'id'> & {
    id: SellingPlanFragmentFragment['id'];
  };
};

export type SelectedOptions = {
  [key: string]: string;
};

export type SelectVariantCallback = (variant: Variant) => void;

export type SelectOptionCallback = (
  name: VariantFragmentFragment['selectedOptions'][0]['name'],
  value: VariantFragmentFragment['selectedOptions'][0]['value']
) => void;

export type SelectOptionsCallback = (options: SelectedOptions) => void;

export type OptionsInStockCallback = (
  name: VariantFragmentFragment['selectedOptions'][0]['name'],
  value: VariantFragmentFragment['selectedOptions'][0]['value']
) => boolean;

export type SelectedSellingPlanCallback = (sellingPlan: SellingPlan) => void;

export interface OptionWithValues {
  name: VariantFragmentFragment['selectedOptions'][0]['name'];
  values: VariantFragmentFragment['selectedOptions'][0]['value'][];
}

export interface ProductOptionsHookValue {
  /** An array of the variant `nodes` from the `VariantConnection`. */
  variants: Variant[];
  variantsConnection?: GraphQLConnection<Variant>;
  /** An array of the product's options and values. */
  options: OptionWithValues[];
  /** The selected variant. */
  selectedVariant?: Variant;
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
  selectedSellingPlan?: SellingPlan;
  /** The selected selling plan allocation. */
  selectedSellingPlanAllocation?: SellingPlanAllocation;
  /** The selling plan groups. */
  sellingPlanGroups?: (Omit<SellingPlanGroup, 'sellingPlans'> & {
    sellingPlans: SellingPlan[];
  })[];
  sellingPlanGroupsConnection?: GraphQLConnection<SellingPlanGroup>;
}
