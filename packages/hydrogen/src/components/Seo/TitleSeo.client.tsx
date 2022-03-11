import React from 'react';
import {Head} from '../../client';

import type {SeoFragmentFragment} from './SeoFragment';

export function TitleSeo({title}: {title?: SeoFragmentFragment['title']}) {
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
