import React from 'react';
import {useUrl} from '../../foundation';

import {DefaultPageSeo} from './DefaultPageSeo.client';
import {HomePageSeo} from './HomePageSeo.client';
import {ProductSeo} from './ProductSeo.client';
import {CollectionSeo} from './CollectionSeo.client';
import {PageSeo} from './PageSeo.client';

import type {DefaultPage, HomePage} from './types';
import type {
  ProductSeoFragment,
  CollectionSeoFragment,
  PageSeoFragment,
} from './SeoFragment';

type Props =
  | {
      type: 'defaultSeo';
      data: Omit<DefaultPage, 'url'>;
    }
  | {
      type: 'homepage';
      data: Omit<HomePage, 'url'>;
    }
  | {
      type: 'product';
      data: ProductSeoFragment;
    }
  | {
      type: 'collection';
      data: CollectionSeoFragment;
    }
  | {
      type: 'page';
      data: PageSeoFragment;
    };

/**
 * The `Seo` component renders SEO information on a webpage.
 */
export function Seo(props: Props) {
  const url = useUrl().href;

  switch (props.type) {
    case 'defaultSeo':
      return <DefaultPageSeo {...{url, ...props.data}} />;
    case 'homepage':
      return <HomePageSeo {...{url, ...props.data}} />;
    case 'product':
      return <ProductSeo {...{url, ...props.data}} />;
    case 'collection':
      return <CollectionSeo {...props.data} />;
    case 'page':
      return <PageSeo {...props.data} />;
    default:
      console.warn(
        'The <Seo/> only accepts type prop with values of defaultSeo, homepage, product, collection, or page.'
      );
      return null;
  }
}
