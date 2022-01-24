import {useShop, Helmet} from '@shopify/hydrogen/client';

import PageLevelSeo from './PageLevelSeo.client';

/**
 * A client component that customizes the output of SEO-related tags in your document `head`
 */
export default function DefaultSeo({shopName, shopDescription, shopUrl}) {
  const {locale} = useShop();
  const lang = locale.split(/[-_]/)[0];

  /* TODO: Find a way to get the full URL */
  const orgUrl =
    typeof window !== 'undefined' ? window.location.href : shopUrl ?? '';

  const organizationSchema = {
    '@context': 'http://schema.org',
    '@type': 'Organization',
    name: shopName,
  };

  const webSiteSchema = {
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    name: shopName,
  };

  if (orgUrl) {
    webSiteSchema.url = orgUrl;
    organizationSchema.url = orgUrl;
  }

  /**
   * Return a global SEO helper if no other props were passed.
   * Useful for placing in the "main" <App> container.
   */
  return (
    <>
      <PageLevelSeo title={shopName} description={shopDescription} />
      <Helmet defaultTitle={shopName} titleTemplate={`%s - ${shopName}`}>
        <html lang={lang} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={shopName} />
        {orgUrl && <meta property="og:url" content={orgUrl} />}

        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>

        <script type="application/ld+json">
          {JSON.stringify(webSiteSchema)}
        </script>
      </Helmet>
    </>
  );
}
