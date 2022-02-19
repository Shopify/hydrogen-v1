import React from 'react';
import {Head} from '../../client';

import {TitleSeo} from './TitleSeo.client';
import {DescriptionSeo} from './DescriptionSeo.client';
import {TwitterSeo} from './TwitterSeo.client';
import {ImageSeo} from './ImageSeo.client';

import {Product} from './types';

export function ProductSeo({
  url,
  title,
  description,
  seo,
  vendor,
  featuredImage,
  variants,
}: Product) {
  const seoTitle = seo?.title ?? title;
  const seoDescription = seo?.description ?? description;

  let firstVariantPrice;

  const productSchema = {
    '@context': 'http://schema.org/',
    '@type': 'Product',
    name: title,
    description,
    brand: {
      '@type': 'Thing',
      name: vendor,
    },
    url,
  } as any;

  productSchema.image = featuredImage.url;

  if (variants.edges.length > 0) {
    const firstVariant = variants.edges[0].node;
    firstVariantPrice = firstVariant.priceV2;

    if (firstVariant && firstVariant.sku) {
      productSchema.sku = firstVariant.sku;
    }

    productSchema.offers = variants.edges.map(({node}) => {
      const offerSchema = {
        '@type': 'Offer',
        availability: `https://schema.org/${
          node.availableForSale ? 'InStock' : 'OutOfStock'
        }`,
        price: node.priceV2.amount,
        priceCurrency: node.priceV2.currencyCode,
      } as any;

      if (node.sku) {
        offerSchema.sku = node.sku;
      }

      if (node.image && node.image.url) {
        offerSchema.image = node.image.url;
      }

      return offerSchema;
    });
  }

  return (
    <>
      <Head>
        <meta property="og:type" content="og:product" />
        {firstVariantPrice && (
          <meta
            property="og:price:amount"
            content={`${firstVariantPrice.amount}`}
          />
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
      </Head>
      <TitleSeo title={seoTitle} />
      <DescriptionSeo description={seoDescription} />
      <TwitterSeo title={seoTitle} description={seoDescription} />
      {featuredImage && <ImageSeo {...featuredImage} />}
    </>
  );
}
