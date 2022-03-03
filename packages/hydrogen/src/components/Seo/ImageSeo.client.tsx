import React from 'react';
import {Head} from '../../client';

import type {ImageSeoFragment} from './SeoFragment';

export function ImageSeo({url, width, height, altText}: ImageSeoFragment) {
  return (
    <Head>
      {url && <meta property="og:image" content={url} />}
      {url && <meta property="og:image:secure_url" content={url} />}
      {width && <meta property="og:image:width" content={`${width}`} />}
      {height && <meta property="og:image:height" content={`${height}`} />}
      {altText && <meta property="og:image:alt" content={altText} />}
    </Head>
  );
}
