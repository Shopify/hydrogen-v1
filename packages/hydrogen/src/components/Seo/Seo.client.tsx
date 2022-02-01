import React from 'react';

import {DefaultPageSeo} from './DefaultPageSeo.client';
import {HomePageSeo} from './HomePageSeo.client';
import {ProductSeo} from './ProductSeo.client';
import {CollectionSeo} from './CollectionSeo.client';
import {PageSeo} from './PageSeo.client';

import type {DefaultPage, HomePage, Product, Collection, Page} from './types';

type Props =
  | {
      type: 'defaultSeo';
      data: DefaultPage;
    }
  | {
      type: 'homepage';
      data: HomePage;
    }
  | {
      type: 'product';
      data: Product;
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
  let SeoMarkup = null;

  switch (type) {
    case 'defaultSeo':
      SeoMarkup = <DefaultPageSeo {...(data as DefaultPage)} />;
      break;
    case 'homepage':
      SeoMarkup = <HomePageSeo {...(data as HomePage)} />;
      break;
    case 'product':
      SeoMarkup = <ProductSeo {...(data as Product)} />;
      break;
    case 'collection':
      SeoMarkup = <CollectionSeo {...(data as Collection)} />;
      break;
    case 'page':
      SeoMarkup = <PageSeo {...(data as Page)} />;
      break;
  }

  return SeoMarkup;
}
