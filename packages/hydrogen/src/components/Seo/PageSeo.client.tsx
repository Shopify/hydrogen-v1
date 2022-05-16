import React from 'react';
import {TitleSeo} from './TitleSeo.client';
import {DescriptionSeo} from './DescriptionSeo.client';
import {TwitterSeo} from './TwitterSeo.client';
import type {Page as PageType} from '../../storefront-api-types';
import type {PartialDeep} from 'type-fest';

export function PageSeo({title, seo}: PartialDeep<PageType>) {
  const seoTitle = seo?.title ?? title;
  const seoDescription = seo?.description;

  return (
    <>
      <TitleSeo title={seoTitle} />
      <DescriptionSeo description={seoDescription} />
      <TwitterSeo title={seoTitle} description={seoDescription} />
    </>
  );
}
