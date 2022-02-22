import React from 'react';
import {Head} from '../../client';

import type {Description} from './types';

export function DescriptionSeo({description}: {description?: Description}) {
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
