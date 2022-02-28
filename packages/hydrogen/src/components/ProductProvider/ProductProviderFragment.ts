/**
 * THIS FILE IS AUTO-GENERATED, DO NOT EDIT.
 * Instead, you can edit the associated .graphql file to query for additional fields and this file will be updated when you run `yarn graphql-types`
 */
// @ts-nocheck
import * as Types from '../../graphql/types/types';

export type ProductProviderFragmentFragment = {
  __typename?: 'Product';
  descriptionHtml: any;
  handle: string;
  id: string;
  title: string;
  compareAtPriceRange: {
    __typename?: 'ProductPriceRange';
    maxVariantPrice: {
      __typename?: 'MoneyV2';
      currencyCode: Types.CurrencyCode;
      amount: any;
    };
    minVariantPrice: {
      __typename?: 'MoneyV2';
      currencyCode: Types.CurrencyCode;
      amount: any;
    };
  };
  media: {
    __typename?: 'MediaConnection';
    edges: Array<{
      __typename?: 'MediaEdge';
      node:
        | {
            __typename?: 'ExternalVideo';
            mediaContentType: Types.MediaContentType;
            id: string;
            embeddedUrl: any;
            host: Types.MediaHost;
          }
        | {
            __typename?: 'MediaImage';
            mediaContentType: Types.MediaContentType;
            image?: {
              __typename?: 'Image';
              id?: string | null;
              url: any;
              altText?: string | null;
              width?: number | null;
              height?: number | null;
            } | null;
          }
        | {
            __typename?: 'Model3d';
            mediaContentType: Types.MediaContentType;
            id: string;
            alt?: string | null;
            previewImage?: {__typename?: 'Image'; url: any} | null;
            sources: Array<{__typename?: 'Model3dSource'; url: string}>;
          }
        | {
            __typename?: 'Video';
            mediaContentType: Types.MediaContentType;
            id: string;
            previewImage?: {__typename?: 'Image'; url: any} | null;
            sources: Array<{
              __typename?: 'VideoSource';
              mimeType: string;
              url: string;
            }>;
          };
    }>;
  };
  metafields: {
    __typename?: 'MetafieldConnection';
    edges: Array<{
      __typename?: 'MetafieldEdge';
      node: {
        __typename?: 'Metafield';
        id: string;
        type: string;
        namespace: string;
        key: string;
        value: string;
        createdAt: any;
        updatedAt: any;
        description?: string | null;
        reference?:
          | {
              __typename: 'MediaImage';
              id: string;
              mediaContentType: Types.MediaContentType;
              image?: {
                __typename?: 'Image';
                id?: string | null;
                url: any;
                altText?: string | null;
                width?: number | null;
                height?: number | null;
              } | null;
            }
          | {__typename: 'Page'}
          | {__typename: 'Product'}
          | {__typename: 'ProductVariant'}
          | null;
      };
    }>;
  };
  priceRange: {
    __typename?: 'ProductPriceRange';
    maxVariantPrice: {
      __typename?: 'MoneyV2';
      currencyCode: Types.CurrencyCode;
      amount: any;
    };
    minVariantPrice: {
      __typename?: 'MoneyV2';
      currencyCode: Types.CurrencyCode;
      amount: any;
    };
  };
  variants: {
    __typename?: 'ProductVariantConnection';
    edges: Array<{
      __typename?: 'ProductVariantEdge';
      node: {
        __typename?: 'ProductVariant';
        id: string;
        title: string;
        availableForSale: boolean;
        image?: {
          __typename?: 'Image';
          id?: string | null;
          url: any;
          altText?: string | null;
          width?: number | null;
          height?: number | null;
        } | null;
        priceV2: {
          __typename?: 'MoneyV2';
          currencyCode: Types.CurrencyCode;
          amount: any;
        };
        compareAtPriceV2?: {
          __typename?: 'MoneyV2';
          currencyCode: Types.CurrencyCode;
          amount: any;
        } | null;
        selectedOptions: Array<{
          __typename?: 'SelectedOption';
          name: string;
          value: string;
        }>;
        metafields: {
          __typename?: 'MetafieldConnection';
          edges: Array<{
            __typename?: 'MetafieldEdge';
            node: {
              __typename?: 'Metafield';
              id: string;
              type: string;
              namespace: string;
              key: string;
              value: string;
              createdAt: any;
              updatedAt: any;
              description?: string | null;
              reference?:
                | {
                    __typename: 'MediaImage';
                    id: string;
                    mediaContentType: Types.MediaContentType;
                    image?: {
                      __typename?: 'Image';
                      id?: string | null;
                      url: any;
                      altText?: string | null;
                      width?: number | null;
                      height?: number | null;
                    } | null;
                  }
                | {__typename: 'Page'}
                | {__typename: 'Product'}
                | {__typename: 'ProductVariant'}
                | null;
            };
          }>;
        };
        sellingPlanAllocations: {
          __typename?: 'SellingPlanAllocationConnection';
          edges: Array<{
            __typename?: 'SellingPlanAllocationEdge';
            node: {
              __typename?: 'SellingPlanAllocation';
              priceAdjustments: Array<{
                __typename?: 'SellingPlanAllocationPriceAdjustment';
                compareAtPrice: {
                  __typename?: 'MoneyV2';
                  currencyCode: Types.CurrencyCode;
                  amount: any;
                };
                perDeliveryPrice: {
                  __typename?: 'MoneyV2';
                  currencyCode: Types.CurrencyCode;
                  amount: any;
                };
                price: {
                  __typename?: 'MoneyV2';
                  currencyCode: Types.CurrencyCode;
                  amount: any;
                };
                unitPrice?: {
                  __typename?: 'MoneyV2';
                  currencyCode: Types.CurrencyCode;
                  amount: any;
                } | null;
              }>;
              sellingPlan: {
                __typename?: 'SellingPlan';
                id: string;
                description?: string | null;
                name: string;
                recurringDeliveries: boolean;
                options: Array<{
                  __typename?: 'SellingPlanOption';
                  name?: string | null;
                  value?: string | null;
                }>;
                priceAdjustments: Array<{
                  __typename?: 'SellingPlanPriceAdjustment';
                  orderCount?: number | null;
                  adjustmentValue:
                    | {
                        __typename?: 'SellingPlanFixedAmountPriceAdjustment';
                        adjustmentAmount: {
                          __typename?: 'MoneyV2';
                          currencyCode: Types.CurrencyCode;
                          amount: any;
                        };
                      }
                    | {
                        __typename?: 'SellingPlanFixedPriceAdjustment';
                        price: {
                          __typename?: 'MoneyV2';
                          currencyCode: Types.CurrencyCode;
                          amount: any;
                        };
                      }
                    | {
                        __typename?: 'SellingPlanPercentagePriceAdjustment';
                        adjustmentPercentage: number;
                      };
                }>;
              };
            };
          }>;
        };
        unitPriceMeasurement?: {
          __typename?: 'UnitPriceMeasurement';
          measuredType?: Types.UnitPriceMeasurementMeasuredType | null;
          quantityUnit?: Types.UnitPriceMeasurementMeasuredUnit | null;
          quantityValue: number;
          referenceUnit?: Types.UnitPriceMeasurementMeasuredUnit | null;
          referenceValue: number;
        } | null;
        unitPrice?: {
          __typename?: 'MoneyV2';
          currencyCode: Types.CurrencyCode;
          amount: any;
        } | null;
      };
    }>;
  };
  sellingPlanGroups: {
    __typename?: 'SellingPlanGroupConnection';
    edges: Array<{
      __typename?: 'SellingPlanGroupEdge';
      node: {
        __typename?: 'SellingPlanGroup';
        appName?: string | null;
        name: string;
        sellingPlans: {
          __typename?: 'SellingPlanConnection';
          edges: Array<{
            __typename?: 'SellingPlanEdge';
            node: {
              __typename?: 'SellingPlan';
              id: string;
              description?: string | null;
              name: string;
              recurringDeliveries: boolean;
              options: Array<{
                __typename?: 'SellingPlanOption';
                name?: string | null;
                value?: string | null;
              }>;
              priceAdjustments: Array<{
                __typename?: 'SellingPlanPriceAdjustment';
                orderCount?: number | null;
                adjustmentValue:
                  | {
                      __typename?: 'SellingPlanFixedAmountPriceAdjustment';
                      adjustmentAmount: {
                        __typename?: 'MoneyV2';
                        currencyCode: Types.CurrencyCode;
                        amount: any;
                      };
                    }
                  | {
                      __typename?: 'SellingPlanFixedPriceAdjustment';
                      price: {
                        __typename?: 'MoneyV2';
                        currencyCode: Types.CurrencyCode;
                        amount: any;
                      };
                    }
                  | {
                      __typename?: 'SellingPlanPercentagePriceAdjustment';
                      adjustmentPercentage: number;
                    };
              }>;
            };
          }>;
        };
        options: Array<{
          __typename?: 'SellingPlanGroupOption';
          name: string;
          values: Array<string>;
        }>;
      };
    }>;
  };
};
