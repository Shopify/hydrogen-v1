import * as Types from '../../graphql/types/types';

import {MoneyFragmentFragment} from '../Money/MoneyFragment';
import {
  MediaFileFragment_ExternalVideo_Fragment,
  MediaFileFragment_MediaImage_Fragment,
  MediaFileFragment_Model3d_Fragment,
  MediaFileFragment_Video_Fragment,
} from '../MediaFile/MediaFileFragment';
import {MetafieldFragmentFragment} from '../Metafield/MetafieldFragment';
import {VariantFragmentFragment} from '../../hooks/useProductOptions/VariantFragment';
import {SellingPlanGroupsFragmentFragment} from '../../hooks/useProductOptions/SellingPlanGroupsFragment';
export type ProductProviderFragmentFragment = {__typename?: 'Product'} & Pick<
  Types.Product,
  'descriptionHtml' | 'handle' | 'id' | 'title'
> & {
    compareAtPriceRange: {__typename?: 'ProductPriceRange'} & {
      maxVariantPrice: {__typename?: 'MoneyV2'} & MoneyFragmentFragment;
      minVariantPrice: {__typename?: 'MoneyV2'} & MoneyFragmentFragment;
    };
    media: {__typename?: 'MediaConnection'} & {
      edges: Array<
        {__typename?: 'MediaEdge'} & {
          node:
            | ({
                __typename?: 'ExternalVideo';
              } & MediaFileFragment_ExternalVideo_Fragment)
            | ({
                __typename?: 'MediaImage';
              } & MediaFileFragment_MediaImage_Fragment)
            | ({__typename?: 'Model3d'} & MediaFileFragment_Model3d_Fragment)
            | ({__typename?: 'Video'} & MediaFileFragment_Video_Fragment);
        }
      >;
    };
    metafields: {__typename?: 'MetafieldConnection'} & {
      edges: Array<
        {__typename?: 'MetafieldEdge'} & {
          node: {__typename?: 'Metafield'} & MetafieldFragmentFragment;
        }
      >;
    };
    priceRange: {__typename?: 'ProductPriceRange'} & {
      maxVariantPrice: {__typename?: 'MoneyV2'} & MoneyFragmentFragment;
      minVariantPrice: {__typename?: 'MoneyV2'} & MoneyFragmentFragment;
    };
    variants: {__typename?: 'ProductVariantConnection'} & {
      edges: Array<
        {__typename?: 'ProductVariantEdge'} & {
          node: {__typename?: 'ProductVariant'} & VariantFragmentFragment;
        }
      >;
    };
    sellingPlanGroups: {__typename?: 'SellingPlanGroupConnection'} & {
      edges: Array<
        {__typename?: 'SellingPlanGroupEdge'} & {
          node: {
            __typename?: 'SellingPlanGroup';
          } & SellingPlanGroupsFragmentFragment;
        }
      >;
    };
  };
