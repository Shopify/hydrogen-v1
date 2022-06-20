import React from 'react';
import {Head} from '../../foundation/Head';
import {useLocalization} from '../../hooks/useLocalization/useLocalization';
import {TitleSeo} from './TitleSeo.client';
import {DescriptionSeo} from './DescriptionSeo.client';
import type {HomePage} from './seo-types';

export function HomePageSeo({
  title,
  description,
  url,
  titleTemplate,
  lang,
}: HomePage) {
  const {
    language: {isoCode: fallBacklang},
  } = useLocalization();

  const organizationSchema = {
    '@context': 'http://schema.org',
    '@type': 'Organization',
    name: title,
    url,
  };

  const webSiteSchema = {
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    name: title,
    url,
  };

  return (
    <>
      <Head
        defaultTitle={title ?? ''}
        titleTemplate={titleTemplate ?? `%s - ${title}`}
      >
        <html lang={lang ?? fallBacklang} />

        <meta property="og:url" content={url} />

        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>

        <script type="application/ld+json">
          {JSON.stringify(webSiteSchema)}
        </script>
      </Head>
      <TitleSeo title={title} />
      {description && <DescriptionSeo description={description} />}
    </>
  );
}
