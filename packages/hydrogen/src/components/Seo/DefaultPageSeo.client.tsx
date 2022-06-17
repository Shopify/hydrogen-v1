import React from 'react';
import {Head} from '../../client';
import {useLocalization} from '../../hooks/useLocalization/useLocalization';

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
  const {
    language: {isoCode: fallBacklang},
  } = useLocalization();

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
