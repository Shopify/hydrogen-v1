import React from 'react';
import {Head, useLocalization} from '../../client';
import type {DefaultPage} from './seo-types';
import type {PartialDeep} from 'type-fest';

export function NoIndexPageSeo({
  title,
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
        <meta name="robots" content="noindex" />
      </Head>
    </>
  );
}
