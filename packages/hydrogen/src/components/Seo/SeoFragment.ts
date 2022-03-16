/**
 * THIS FILE IS AUTO-GENERATED, DO NOT EDIT.
 * Instead, you can edit the associated .graphql file to query for additional fields and this file will be updated when you run `yarn graphql-types`
 */
// @ts-nocheck
import * as Types from '../../storefront-api-types';

export type DefaultPageSeoFragmentFragment = {__typename?: 'Shop'} & Pick<
  Types.Shop,
  'description'
> & {title: Types.Shop['name']};

export type HomeSeoFragmentFragment = {__typename?: 'Shop'} & Pick<
  Types.Shop,
  'description'
> & {title: Types.Shop['name']};

export type ImageSeoFragmentFragment = {__typename?: 'Image'} & Pick<
  Types.Image,
  'url' | 'width' | 'height' | 'altText'
>;

export type SeoFragmentFragment = {__typename?: 'SEO'} & Pick<
  Types.Seo,
  'description' | 'title'
>;

export type ProductSeoFragmentFragment = {__typename?: 'Product'} & Pick<
  Types.Product,
  'title' | 'description' | 'vendor'
> & {
    seo: {__typename?: 'SEO'} & Pick<Types.Seo, 'description' | 'title'>;
    featuredImage?: Types.Maybe<
      {__typename?: 'Image'} & Pick<
        Types.Image,
        'url' | 'width' | 'height' | 'altText'
      >
    >;
    variants: {__typename?: 'ProductVariantConnection'} & {
      edges: Array<
        {__typename?: 'ProductVariantEdge'} & {
          node: {__typename?: 'ProductVariant'} & Pick<
            Types.ProductVariant,
            'availableForSale' | 'sku'
          > & {
              image?: Types.Maybe<
                {__typename?: 'Image'} & Pick<Types.Image, 'url'>
              >;
              priceV2: {__typename?: 'MoneyV2'} & Pick<
                Types.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
        }
      >;
    };
  };

export type CollectionSeoFragmentFragment = {__typename?: 'Collection'} & Pick<
  Types.Collection,
  'title' | 'description'
> & {
    seo: {__typename?: 'SEO'} & Pick<Types.Seo, 'description' | 'title'>;
    image?: Types.Maybe<
      {__typename?: 'Image'} & Pick<
        Types.Image,
        'url' | 'width' | 'height' | 'altText'
      >
    >;
  };

export type PageSeoFragmentFragment = {__typename?: 'Page'} & Pick<
  Types.Page,
  'title'
> & {
    seo?: Types.Maybe<
      {__typename?: 'SEO'} & Pick<Types.Seo, 'description' | 'title'>
    >;
  };
