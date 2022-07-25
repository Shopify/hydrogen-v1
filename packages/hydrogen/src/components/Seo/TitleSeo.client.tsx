import React from 'react';
import {Head} from '../../foundation/Head/index.js';
import type {Seo as SeoType} from '../../storefront-api-types.js';
import type {PartialDeep} from 'type-fest';

export function TitleSeo({title}: PartialDeep<SeoType>) {
  if (!title) {
    return null;
  }

  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
    </Head>
  );
}
