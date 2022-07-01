import React from 'react';

import {TitleSeo} from './TitleSeo.client.jsx';
import {DescriptionSeo} from './DescriptionSeo.client.jsx';
import {TwitterSeo} from './TwitterSeo.client.jsx';
import {ImageSeo} from './ImageSeo.client.jsx';
import type {Collection as CollectionType} from '../../storefront-api-types.js';
import type {PartialDeep} from 'type-fest';

export function CollectionSeo({
  title,
  description,
  seo,
  image,
}: PartialDeep<CollectionType>) {
  const seoTitle = seo?.title ?? title;
  const seoDescription = seo?.description ?? description;

  return (
    <>
      <TitleSeo title={seoTitle} />
      <DescriptionSeo description={seoDescription} />
      <TwitterSeo title={seoTitle} description={seoDescription} />
      {image && <ImageSeo {...image} />}
    </>
  );
}
