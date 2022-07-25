import React from 'react';
import {Head} from '../../foundation/Head/index.js';
import type {Twitter} from './seo-types.js';

export function TwitterSeo({site, title, description}: Partial<Twitter>) {
  return (
    <Head>
      <meta name="twitter:card" content="summary_large_image" />
      {site && <meta name="twitter:site" content={site} />}
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
    </Head>
  );
}
