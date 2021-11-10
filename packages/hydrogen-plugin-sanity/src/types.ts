import {ProductToFetch} from './extractProductsToFetch';

// Adapted from @sanity/client
export interface ClientConfig {
  projectId?: string
  dataset?: string
  useCdn?: boolean
  token?: string
  apiHost?: string
  apiVersion?: string
  proxy?: string
  requestTagPrefix?: string
  ignoreBrowserTokenWarning?: boolean
  withCredentials?: boolean
}

export interface SanityQueryClientOptions {
  /**
   * (Optional) customize your global Sanity client configuration.
   * You should set a `sanity` object in `shopify.config.js` with global configuration first.
   */
  clientConfig?: ClientConfig;

  shopifyVariables?: {
    numProductMetafields?: number;
    numProductVariants?: number;
    numProductMedia?: number;
    numProductVariantMetafields?: number;
    numProductVariantSellingPlanAllocations?: number;
    numProductSellingPlanGroups?: number;
    numProductSellingPlans?: number;
  };

  /**
   * Given a product's id & occurrence, what data should it fetch from Shopify?
   *
   * Return false if you don't want to fetch data for a given product.
   * Defaults to Hydrogen's ProductProviderFragment.
   */
  getProductGraphQLFragment?: (product: ProductToFetch) => string | boolean;
}

export interface UseSanityQueryResponse<T> {

  /** The data returned by the query. */
  sanityData: T;
  shopifyProducts?: {[key: string]: unknown};
  errors: any;
}
