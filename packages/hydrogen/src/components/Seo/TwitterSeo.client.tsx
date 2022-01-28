import React from 'react';
import {Helmet} from 'react-helmet-async';

import type {Twitter} from './types';

export function TwitterSeo({site, title, description}: Partial<Twitter>) {
  return (
    <Helmet>
      <meta name="twitter:card" content="summary_large_image" />
      {site && <meta name="twitter:site" content={site} />}
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
    </Helmet>
  );
}
