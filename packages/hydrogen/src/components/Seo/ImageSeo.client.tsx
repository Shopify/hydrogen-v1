import React from 'react';
import {Head} from '../../client';

import type {Image} from './types';

export function ImageSeo({url, width, height, altText}: Partial<Image>) {
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
