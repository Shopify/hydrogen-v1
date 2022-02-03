import React from 'react';
import {useShop} from '../../foundation';
import {Helmet} from '../../client';

import {TitleSeo} from './TitleSeo.client';
import {DescriptionSeo} from './DescriptionSeo.client';
import {TwitterSeo} from './TwitterSeo.client';

import type {DefaultPage} from './types';

export function DefaultPageSeo({
  title,
  description,
  url,
  titleTemplate,
  lang,
}: DefaultPage) {
  const {locale} = useShop();
  const fallBacklang = locale.split(/[-_]/)[0];

  return (
    <>
      <Helmet
        defaultTitle={title}
        titleTemplate={titleTemplate ?? `%s - ${title}`}
      >
        <html lang={lang ?? fallBacklang} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={title} />
        <meta property="og:url" content={url} />
      </Helmet>
      <TitleSeo title={title} />
      <DescriptionSeo description={description} />
      <TwitterSeo title={title} description={description} />
    </>
  );
}
