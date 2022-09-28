import React from 'react';
import {Head} from '../../foundation/Head/index.js';
import {TitleSeo} from './TitleSeo.client.js';
import {DescriptionSeo} from './DescriptionSeo.client.js';
import type {HomePage} from './seo-types.js';

export function HomePageSeo({
  title,
  description,
  url,
  titleTemplate,
}: HomePage) {
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
      <Head defaultTitle={title ?? ''} titleTemplate={titleTemplate ?? `%s`}>
        <meta property="og:url" content={url} />

        {/* eslint-disable-next-line hydrogen/prefer-script-component */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>

        {/* eslint-disable-next-line hydrogen/prefer-script-component */}
        <script type="application/ld+json">
          {JSON.stringify(webSiteSchema)}
        </script>
      </Head>
      <TitleSeo title={title} />
      {description && <DescriptionSeo description={description} />}
    </>
  );
}
