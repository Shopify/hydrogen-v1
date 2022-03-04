import React from 'react';

import {TitleSeo} from './TitleSeo.client';
import {DescriptionSeo} from './DescriptionSeo.client';
import {TwitterSeo} from './TwitterSeo.client';
import {ImageSeo} from './ImageSeo.client';

import type {CollectionSeoFragment} from './SeoFragment';

export function CollectionSeo({
  title,
  description,
  seo,
  image,
}: CollectionSeoFragment) {
  const seoTitle = seo.title ?? title;
  const seoDescription = seo.description ?? description;

  return (
    <>
      <TitleSeo title={seoTitle} />
      <DescriptionSeo description={seoDescription} />
      <TwitterSeo title={seoTitle} description={seoDescription} />
      {image && <ImageSeo {...image} />}
    </>
  );
}
