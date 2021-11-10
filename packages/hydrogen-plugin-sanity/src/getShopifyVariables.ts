import {SanityQueryClientOptions} from './types';

const getShopifyVariables = (
  customVariables: SanityQueryClientOptions['shopifyVariables'] = {},
): Required<SanityQueryClientOptions['shopifyVariables']> => {
  return {
    // Defaults taken from https://shopify.dev/beta/hydrogen/getting-started#step-4-make-graphql-changes
    numProductMetafields: 0,
    numProductVariants: 250,
    numProductMedia: 1,
    numProductVariantMetafields: 10,
    numProductVariantSellingPlanAllocations: 10,
    numProductSellingPlanGroups: 10,
    numProductSellingPlans: 10,
    ...(customVariables || {}),
  };
};

export default getShopifyVariables;
