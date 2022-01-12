import {useShop, Helmet} from '@shopify/hydrogen/client';

/**
 * A client component that customizes the output of SEO-related tags in your document `head`
 */
export default function Seo({shopName, product}) {
  const {locale} = useShop();
  const lang = locale.split(/[-_]/)[0];

  if (product) {
    const variant = product.variants.edges[0].node;
    const price = variant.priceV2;
    const image = product.images.edges[0]?.node;
    const title = product.seo?.title ?? product.title;
    const description = product.seo?.description ?? product.description;

    /* TODO: Find a way to get the full URL */
    const url = typeof window === 'undefined' ? '' : window.location.href;

    return (
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        {url && <meta property="og:url" content={url} />}
        <meta property="og:title" content={title} />
        <meta property="og:type" content="product" />
        <meta property="og:description" content={description} />
        <meta property="og:price:amount" content={price.amount} />
        <meta property="og:price:currency" content={price.currencyCode} />

        {image && <meta property="og:image" content={image.url} />}
        {image && <meta property="og:image:secure_url" content={image.url} />}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />

        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": "${product.title}",
            "image": [
              ${image ? `"${image.url}"` : ''}
            ],
            "description": "${description}",
            "brand": {
              "@type": "Brand",
              "name": "${product.vendor}"
            },
            "offers": {
              "@type": "Offer",
              "url": "${url}",
              "priceCurrency": "${price.currencyCode}",
              "price": "${price.amount}",
              "availability": "https://schema.org/${
                variant.availableForSale ? 'InStock' : 'OutOfStock'
              }"
            }
          }
        `}</script>
      </Helmet>
    );
  }

  /**
   * Return a global SEO helper if no other props were passed.
   * Useful for placing in the "main" <App> container.
   */
  return (
    <Helmet defaultTitle={shopName} titleTemplate={`%s - ${shopName}`}>
      <html lang={lang} />
      <meta property="og:site_name" content={shopName} />
    </Helmet>
  );
}
