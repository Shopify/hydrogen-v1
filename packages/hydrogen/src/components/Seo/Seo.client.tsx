import React from 'react';
import {useUrl} from '../../foundation';

import {DefaultPageSeo} from './DefaultPageSeo.client';
import {HomePageSeo} from './HomePageSeo.client';
import {ProductSeo} from './ProductSeo.client';
import {CollectionSeo} from './CollectionSeo.client';
import {PageSeo} from './PageSeo.client';

import type {DefaultPage, HomePage, Product, Collection, Page} from './types';

type Props =
  | {
      type: 'defaultSeo';
      data: Pick<DefaultPage, Exclude<keyof DefaultPage, 'url'>>;
    }
  | {
      type: 'homepage';
      data: Pick<HomePage, Exclude<keyof HomePage, 'url'>>;
    }
  | {
      type: 'product';
      data: Pick<Product, Exclude<keyof Product, 'url'>>;
    }
  | {
      type: 'collection';
      data: Collection;
    }
  | {
      type: 'page';
      data: Page;
    };

/**
 * The `Seo` component renders SEO information on a webpage.
 */
export function Seo({type, data}: Props) {
  const url = useUrl().href;

  let SeoMarkup = null;

  switch (type) {
    case 'defaultSeo':
      SeoMarkup = <DefaultPageSeo {...({url, ...data} as DefaultPage)} />;
      break;
    case 'homepage':
      SeoMarkup = <HomePageSeo {...({url, ...data} as HomePage)} />;
      break;
    case 'product':
      SeoMarkup = <ProductSeo {...({url, ...data} as Product)} />;
      break;
    case 'collection':
      SeoMarkup = <CollectionSeo {...(data as Collection)} />;
      break;
    case 'page':
      SeoMarkup = <PageSeo {...(data as Page)} />;
      break;
    default:
      console.warn(
        'The <Seo/> only accepts type prop with values of defaultSeo, homepage, product, collection, or page.'
      );
  }

  return SeoMarkup;
}
