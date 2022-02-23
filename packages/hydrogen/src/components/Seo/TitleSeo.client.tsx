import React from 'react';
import {Head} from '../../client';

import type {Title} from './types';

export function TitleSeo({title}: {title?: Title}) {
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
