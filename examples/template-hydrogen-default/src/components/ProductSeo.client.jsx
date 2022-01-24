import {Helmet} from '@shopify/hydrogen/client';

import ImageSeo from './ImageSeo.client';
import PageLevelSeo from './PageLevelSeo.client';

export default function ProductSeo({product, shopUrl}) {
  if (!product) {
    return null;
  }

  const orgUrl =
    typeof window !== 'undefined' ? window.location.href : shopUrl ?? '';

  const title = product.seo?.title ?? product.title;
  const description = product.seo?.description ?? product.description;

  let firstVariantPrice;
  let firstImage;

  const productSchema = {
    '@context': 'http://schema.org/',
    '@type': 'Product',
    name: title,
    description,
    brand: {
      '@type': 'Thing',
      name: product.vendor,
    },
  };

  if (orgUrl) {
    productSchema.url = `${orgUrl}/products/${product.handle}`;
  }

  if (product.images.edges.length > 0) {
    firstImage = product.images.edges[0]?.node;
    productSchema.image = firstImage.url;
  }

  if (product.variants.edges.length > 0) {
    const firstVariant = product.variants.edges[0].node;
    firstVariantPrice = firstVariant.priceV2;

    if (firstVariant && firstVariant.sku) {
      productSchema.sku = firstVariant.sku;
    }

    productSchema.offers = product.variants.edges.map(({node}) => {
      const offerSchema = {
        '@type': 'Offer',
        availability: `https://schema.org/${
          node.availableForSale ? 'InStock' : 'OutOfStock'
        }`,
        price: node.priceV2.amount,
        priceCurrency: node.priceV2.currencyCode,
      };

      if (node.sku) {
        offerSchema.sku = node.sku;
      }

      return offerSchema;
    });
  }

  return (
    <>
      <PageLevelSeo title={title} description={description} />
      <ImageSeo image={firstImage} />
      <Helmet>
        <meta property="og:type" content="product" />
        {firstVariantPrice && (
          <meta property="og:price:amount" content={firstVariantPrice.amount} />
        )}
        {firstVariantPrice && (
          <meta
            property="og:price:currency"
            content={firstVariantPrice.currencyCode}
          />
        )}

        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      </Helmet>
    </>
  );
}
