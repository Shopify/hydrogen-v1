import React from 'react';
import {Head} from '../../client';
import type {Seo as SeoType} from '../../storefront-api-types';

export function DescriptionSeo({
  description,
}: {
  description?: SeoType['description'];
}) {
  if (!description) {
    return null;
  }

  return (
    <Head>
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
    </Head>
  );
}
