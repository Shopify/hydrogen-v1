import React from 'react';
import {Head} from '../../client';
import {TitleSeo} from './TitleSeo.client';
import {DescriptionSeo} from './DescriptionSeo.client';
import type {HomePage} from './seo-types';

export function HomePageSeo({title, description, url}: HomePage) {
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
      <Head>
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
