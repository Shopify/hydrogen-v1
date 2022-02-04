import React from 'react';
import {Helmet} from 'react-helmet-async';

import type {Description} from './types';

export function DescriptionSeo({description}: {description?: Description}) {
  if (!description) {
    return null;
  }

  return (
    <Helmet>
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
    </Helmet>
  );
}
