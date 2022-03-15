/**
 * THIS FILE IS AUTO-GENERATED, DO NOT EDIT.
 * Instead, you can edit the associated .graphql file to query for additional fields and this file will be updated when you run `yarn graphql-types`
 */
// @ts-nocheck
import * as Types from '../../storefront-api-types';

export type ProductProviderFragmentFragment = {__typename?: 'Product'} & Pick<
  Types.Product,
  'descriptionHtml' | 'handle' | 'id' | 'title'
> & {
    compareAtPriceRange: {__typename?: 'ProductPriceRange'} & {
      maxVariantPrice: {__typename?: 'MoneyV2'} & Pick<
        Types.MoneyV2,
        'currencyCode' | 'amount'
      >;
      minVariantPrice: {__typename?: 'MoneyV2'} & Pick<
        Types.MoneyV2,
        'currencyCode' | 'amount'
      >;
    };
    media: {__typename?: 'MediaConnection'} & {
      edges: Array<
        {__typename?: 'MediaEdge'} & {
          node:
            | ({__typename?: 'ExternalVideo'} & Pick<
                Types.ExternalVideo,
                'mediaContentType' | 'id' | 'embedUrl' | 'host'
              >)
            | ({__typename?: 'MediaImage'} & Pick<
                Types.MediaImage,
                'mediaContentType'
              > & {
                  image?: Types.Maybe<
                    {__typename?: 'Image'} & Pick<
                      Types.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                })
            | ({__typename?: 'Model3d'} & Pick<
                Types.Model3d,
                'mediaContentType' | 'id' | 'alt'
              > & {
                  previewImage?: Types.Maybe<
                    {__typename?: 'Image'} & Pick<Types.Image, 'url'>
                  >;
                  sources: Array<
                    {__typename?: 'Model3dSource'} & Pick<
                      Types.Model3dSource,
                      'url'
                    >
                  >;
                })
            | ({__typename?: 'Video'} & Pick<
                Types.Video,
                'mediaContentType' | 'id'
              > & {
                  previewImage?: Types.Maybe<
                    {__typename?: 'Image'} & Pick<Types.Image, 'url'>
                  >;
                  sources: Array<
                    {__typename?: 'VideoSource'} & Pick<
                      Types.VideoSource,
                      'mimeType' | 'url'
                    >
                  >;
                });
        }
      >;
    };
    metafields: {__typename?: 'MetafieldConnection'} & {
      edges: Array<
        {__typename?: 'MetafieldEdge'} & {
          node: {__typename?: 'Metafield'} & Pick<
            Types.Metafield,
            | 'id'
            | 'type'
            | 'namespace'
            | 'key'
            | 'value'
            | 'createdAt'
            | 'updatedAt'
            | 'description'
          > & {
              reference?: Types.Maybe<
                | ({__typename: 'MediaImage'} & Pick<
                    Types.MediaImage,
                    'id' | 'mediaContentType'
                  > & {
                      image?: Types.Maybe<
                        {__typename?: 'Image'} & Pick<
                          Types.Image,
                          'id' | 'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                    })
                | {__typename: 'Page'}
                | {__typename: 'Product'}
                | {__typename: 'ProductVariant'}
              >;
            };
        }
      >;
    };
    priceRange: {__typename?: 'ProductPriceRange'} & {
      maxVariantPrice: {__typename?: 'MoneyV2'} & Pick<
        Types.MoneyV2,
        'currencyCode' | 'amount'
      >;
      minVariantPrice: {__typename?: 'MoneyV2'} & Pick<
        Types.MoneyV2,
        'currencyCode' | 'amount'
      >;
    };
    variants: {__typename?: 'ProductVariantConnection'} & {
      edges: Array<
        {__typename?: 'ProductVariantEdge'} & {
          node: {__typename?: 'ProductVariant'} & Pick<
            Types.ProductVariant,
            'id' | 'title' | 'availableForSale'
          > & {
              image?: Types.Maybe<
                {__typename?: 'Image'} & Pick<
                  Types.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
              unitPriceMeasurement?: Types.Maybe<
                {__typename?: 'UnitPriceMeasurement'} & Pick<
                  Types.UnitPriceMeasurement,
                  | 'measuredType'
                  | 'quantityUnit'
                  | 'quantityValue'
                  | 'referenceUnit'
                  | 'referenceValue'
                >
              >;
              unitPrice?: Types.Maybe<
                {__typename?: 'MoneyV2'} & Pick<
                  Types.MoneyV2,
                  'currencyCode' | 'amount'
                >
              >;
              priceV2: {__typename?: 'MoneyV2'} & Pick<
                Types.MoneyV2,
                'currencyCode' | 'amount'
              >;
              compareAtPriceV2?: Types.Maybe<
                {__typename?: 'MoneyV2'} & Pick<
                  Types.MoneyV2,
                  'currencyCode' | 'amount'
                >
              >;
              selectedOptions: Array<
                {__typename?: 'SelectedOption'} & Pick<
                  Types.SelectedOption,
                  'name' | 'value'
                >
              >;
              metafields: {__typename?: 'MetafieldConnection'} & {
                edges: Array<
                  {__typename?: 'MetafieldEdge'} & {
                    node: {__typename?: 'Metafield'} & Pick<
                      Types.Metafield,
                      | 'id'
                      | 'type'
                      | 'namespace'
                      | 'key'
                      | 'value'
                      | 'createdAt'
                      | 'updatedAt'
                      | 'description'
                    > & {
                        reference?: Types.Maybe<
                          | ({__typename: 'MediaImage'} & Pick<
                              Types.MediaImage,
                              'id' | 'mediaContentType'
                            > & {
                                image?: Types.Maybe<
                                  {__typename?: 'Image'} & Pick<
                                    Types.Image,
                                    | 'id'
                                    | 'url'
                                    | 'altText'
                                    | 'width'
                                    | 'height'
                                  >
                                >;
                              })
                          | {__typename: 'Page'}
                          | {__typename: 'Product'}
                          | {__typename: 'ProductVariant'}
                        >;
                      };
                  }
                >;
              };
              sellingPlanAllocations: {
                __typename?: 'SellingPlanAllocationConnection';
              } & {
                edges: Array<
                  {__typename?: 'SellingPlanAllocationEdge'} & {
                    node: {__typename?: 'SellingPlanAllocation'} & {
                      priceAdjustments: Array<
                        {
                          __typename?: 'SellingPlanAllocationPriceAdjustment';
                        } & {
                          compareAtPrice: {__typename?: 'MoneyV2'} & Pick<
                            Types.MoneyV2,
                            'currencyCode' | 'amount'
                          >;
                          perDeliveryPrice: {__typename?: 'MoneyV2'} & Pick<
                            Types.MoneyV2,
                            'currencyCode' | 'amount'
                          >;
                          price: {__typename?: 'MoneyV2'} & Pick<
                            Types.MoneyV2,
                            'currencyCode' | 'amount'
                          >;
                          unitPrice?: Types.Maybe<
                            {__typename?: 'MoneyV2'} & Pick<
                              Types.MoneyV2,
                              'currencyCode' | 'amount'
                            >
                          >;
                        }
                      >;
                      sellingPlan: {__typename?: 'SellingPlan'} & Pick<
                        Types.SellingPlan,
                        'id' | 'description' | 'name' | 'recurringDeliveries'
                      > & {
                          options: Array<
                            {__typename?: 'SellingPlanOption'} & Pick<
                              Types.SellingPlanOption,
                              'name' | 'value'
                            >
                          >;
                          priceAdjustments: Array<
                            {__typename?: 'SellingPlanPriceAdjustment'} & Pick<
                              Types.SellingPlanPriceAdjustment,
                              'orderCount'
                            > & {
                                adjustmentValue:
                                  | ({
                                      __typename?: 'SellingPlanFixedAmountPriceAdjustment';
                                    } & {
                                      adjustmentAmount: {
                                        __typename?: 'MoneyV2';
                                      } & Pick<
                                        Types.MoneyV2,
                                        'currencyCode' | 'amount'
                                      >;
                                    })
                                  | ({
                                      __typename?: 'SellingPlanFixedPriceAdjustment';
                                    } & {
                                      price: {__typename?: 'MoneyV2'} & Pick<
                                        Types.MoneyV2,
                                        'currencyCode' | 'amount'
                                      >;
                                    })
                                  | ({
                                      __typename?: 'SellingPlanPercentagePriceAdjustment';
                                    } & Pick<
                                      Types.SellingPlanPercentagePriceAdjustment,
                                      'adjustmentPercentage'
                                    >);
                              }
                          >;
                        };
                    };
                  }
                >;
              };
            };
        }
      >;
    };
    sellingPlanGroups: {__typename?: 'SellingPlanGroupConnection'} & {
      edges: Array<
        {__typename?: 'SellingPlanGroupEdge'} & {
          node: {__typename?: 'SellingPlanGroup'} & Pick<
            Types.SellingPlanGroup,
            'appName' | 'name'
          > & {
              sellingPlans: {__typename?: 'SellingPlanConnection'} & {
                edges: Array<
                  {__typename?: 'SellingPlanEdge'} & {
                    node: {__typename?: 'SellingPlan'} & Pick<
                      Types.SellingPlan,
                      'id' | 'description' | 'name' | 'recurringDeliveries'
                    > & {
                        options: Array<
                          {__typename?: 'SellingPlanOption'} & Pick<
                            Types.SellingPlanOption,
                            'name' | 'value'
                          >
                        >;
                        priceAdjustments: Array<
                          {__typename?: 'SellingPlanPriceAdjustment'} & Pick<
                            Types.SellingPlanPriceAdjustment,
                            'orderCount'
                          > & {
                              adjustmentValue:
                                | ({
                                    __typename?: 'SellingPlanFixedAmountPriceAdjustment';
                                  } & {
                                    adjustmentAmount: {
                                      __typename?: 'MoneyV2';
                                    } & Pick<
                                      Types.MoneyV2,
                                      'currencyCode' | 'amount'
                                    >;
                                  })
                                | ({
                                    __typename?: 'SellingPlanFixedPriceAdjustment';
                                  } & {
                                    price: {__typename?: 'MoneyV2'} & Pick<
                                      Types.MoneyV2,
                                      'currencyCode' | 'amount'
                                    >;
                                  })
                                | ({
                                    __typename?: 'SellingPlanPercentagePriceAdjustment';
                                  } & Pick<
                                    Types.SellingPlanPercentagePriceAdjustment,
                                    'adjustmentPercentage'
                                  >);
                            }
                        >;
                      };
                  }
                >;
              };
              options: Array<
                {__typename?: 'SellingPlanGroupOption'} & Pick<
                  Types.SellingPlanGroupOption,
                  'name' | 'values'
                >
              >;
            };
        }
      >;
    };
  };
