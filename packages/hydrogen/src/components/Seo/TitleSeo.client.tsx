import React from 'react';
import {Helmet} from '../../client';

import type {Title} from './types';

export function TitleSeo({title}: {title?: Title}) {
  if (!title) {
    return null;
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:title" content={title} />
    </Helmet>
  );
}
