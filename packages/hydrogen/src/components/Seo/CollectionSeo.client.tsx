import React from 'react';
import {Head} from '../../foundation/Head';
import {TitleSeo} from './TitleSeo.client';
import {DescriptionSeo} from './DescriptionSeo.client';
import {TwitterSeo} from './TwitterSeo.client';
import {ImageSeo} from './ImageSeo.client';
import type {
  Scalars,
  Collection as CollectionType,
} from '../../storefront-api-types';
import type {PartialDeep} from 'type-fest';

export function CollectionSeo({
  url,
  title,
  description,
  seo,
  image,
}: PartialDeep<CollectionType> & {url: Scalars['URL']}) {
  const seoTitle = seo?.title ?? title;
  const seoDescription = seo?.description ?? description;

  return (
    <>
      <Head>
        <meta property="og:url" content={url} />
      </Head>
      <TitleSeo title={seoTitle} />
      <DescriptionSeo description={seoDescription} />
      <TwitterSeo title={seoTitle} description={seoDescription} />
      {image && <ImageSeo {...image} />}
    </>
  );
}
