import React from 'react';
import {useLocalization} from '../../hooks/useLocalization/useLocalization.js';
import {Head} from '../../foundation/Head/Head.client.js';
import type {DefaultPage} from './seo-types.js';
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
