import React from 'react';
import {useShop} from '../../foundation';
import {Head} from '../../client';

import type {DefaultPage} from './seo-types';
import type {PartialDeep} from 'type-fest';

export function NoIndexPageSeo({
  title,
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
        <meta name="robots" content="noindex" />
      </Head>
    </>
  );
}
