import React from 'react';
import {Head} from '../../client';

import type {SeoFragmentFragment} from './SeoFragment';

export function DescriptionSeo({
  description,
}: {
  description?: SeoFragmentFragment['description'];
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
