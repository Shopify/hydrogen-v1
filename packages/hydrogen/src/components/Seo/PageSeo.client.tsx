import React from 'react';

import {TitleSeo} from './TitleSeo.client';
import {DescriptionSeo} from './DescriptionSeo.client';
import {TwitterSeo} from './TwitterSeo.client';

import {PageSeoFragmentFragment} from './SeoFragment';

export function PageSeo({title, seo}: PageSeoFragmentFragment) {
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
