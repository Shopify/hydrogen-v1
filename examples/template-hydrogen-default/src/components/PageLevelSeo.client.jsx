import {Helmet} from '@shopify/hydrogen/client';

export default function PageLevelSeo({title, description, twitterLink}) {
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {title && <meta property="og:title" content={title} />}

      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}

      {twitterLink && <meta name="twitter:site" content={twitterLink} />}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
    </Helmet>
  );
}
