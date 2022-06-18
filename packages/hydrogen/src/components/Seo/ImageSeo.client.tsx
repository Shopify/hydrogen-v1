import React from 'react';
import {Head} from '../../foundation/Head';
import type {Image} from '../../storefront-api-types';
import type {PartialDeep} from 'type-fest';

export function ImageSeo({url, width, height, altText}: PartialDeep<Image>) {
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
