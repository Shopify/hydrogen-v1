import React from 'react';

import {DefaultPageSeo} from './DefaultPageSeo.client';
import {HomePageSeo} from './HomePageSeo.client';
import {ProductSeo} from './ProductSeo.client';
import {CollectionSeo} from './CollectionSeo.client';
import {PageSeo} from './PageSeo.client';
import {TitleSeo} from './TitleSeo.client';
import {DescriptionSeo} from './DescriptionSeo.client';
import {TwitterSeo} from './TwitterSeo.client';
import {ImageSeo} from './ImageSeo.client';

import {checkInvalidOverride} from './utilities';

import type {
  DefaultPage,
  HomePage,
  Product,
  Collection,
  Page,
  Title,
  Description,
  Twitter,
  Image,
} from './types';

interface Props {
  defaultPage?: DefaultPage;
  homePage?: HomePage;
  product?: Product;
  collection?: Collection;
  page?: Page;
  title?: Title;
  description?: Description;
  twitter?: Partial<Twitter>;
  image?: Partial<Image>;
}

const validOverrides = [
  {
    baseProp: 'defaultPage',
    validProps: ['image'],
  },
  {
    baseProp: 'homePage',
    validProps: ['description', 'twitter', 'image'],
  },
  {
    baseProp: 'product',
    validProps: [],
  },
  {
    baseProp: 'collection',
    validProps: [],
  },
  {
    baseProp: 'page',
    validProps: ['image'],
  },
  {
    baseProp: 'title',
    validProps: [],
  },
  {
    baseProp: 'description',
    validProps: ['homePage'],
  },
  {
    baseProp: 'twitter',
    validProps: ['homePage'],
  },
  {
    baseProp: 'image',
    validProps: ['defaultPage', 'homePage', 'page'],
  },
];

export function Seo(props: Props) {
  const {
    defaultPage,
    homePage,
    product,
    collection,
    page,
    title,
    description,
    twitter,
    image,
  } = props;

  checkInvalidOverride(props, validOverrides);

  return (
    <>
      {defaultPage && <DefaultPageSeo {...defaultPage} />}
      {homePage && <HomePageSeo {...homePage} />}
      {product && <ProductSeo {...product} />}
      {collection && <CollectionSeo {...collection} />}
      {page && <PageSeo {...page} />}
      {title && <TitleSeo title={title} />}
      {description && <DescriptionSeo description={description} />}
      {twitter && <TwitterSeo {...twitter} />}
      {image && <ImageSeo {...image} />}
    </>
  );
}
