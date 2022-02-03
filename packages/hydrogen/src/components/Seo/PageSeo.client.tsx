import React from 'react';

import {TitleSeo} from './TitleSeo.client';
import {DescriptionSeo} from './DescriptionSeo.client';
import {TwitterSeo} from './TwitterSeo.client';

import {Page} from './types';

export function PageSeo({title, seo}: Page) {
  const seoTitle = seo.title ?? title;
  const seoDescription = seo.description;

  return (
    <>
      <TitleSeo title={seoTitle} />
      <DescriptionSeo description={seoDescription} />
      <TwitterSeo title={seoTitle} description={seoDescription} />
    </>
  );
}
