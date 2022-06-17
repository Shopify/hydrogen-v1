import React from 'react';
import {useShop} from '../../foundation/useShop';
import {Head} from '../../foundation/Head';

import {TitleSeo} from './TitleSeo.client';
import {DescriptionSeo} from './DescriptionSeo.client';
import {TwitterSeo} from './TwitterSeo.client';
import type {DefaultPage} from './seo-types';
import type {PartialDeep} from 'type-fest';

export function DefaultPageSeo({
  title,
  description,
  url,
  titleTemplate,
  lang,
}: PartialDeep<DefaultPage>) {
  const {languageCode: fallBacklang} = useShop();

  return (
    <>
      <Head
        defaultTitle={title ?? ''}
        titleTemplate={titleTemplate ?? `%s - ${title}`}
      >
        <html lang={lang ?? fallBacklang} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={title ?? ''} />
        <meta property="og:url" content={url} />
      </Head>
      <TitleSeo title={title} />
      <DescriptionSeo description={description} />
      <TwitterSeo title={title} description={description} />
    </>
  );
}
