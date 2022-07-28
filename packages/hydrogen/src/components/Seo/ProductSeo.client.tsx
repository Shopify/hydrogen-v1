import React from 'react';
import {Head} from '../../foundation/Head/index.js';
import {TitleSeo} from './TitleSeo.client.js';
import {DescriptionSeo} from './DescriptionSeo.client.js';
import {TwitterSeo} from './TwitterSeo.client.js';
import {ImageSeo} from './ImageSeo.client.js';
import type {
  Scalars,
  Product as ProductType,
} from '../../storefront-api-types.js';
import type {PartialDeep} from 'type-fest';
import {flattenConnection} from '../../utilities/flattenConnection/index.js';

export function ProductSeo({
  url,
  title,
  description,
  seo,
  vendor,
  featuredImage,
  variants,
}: PartialDeep<ProductType> & {url: Scalars['URL']}) {
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

  if (featuredImage) {
    productSchema.image = featuredImage.url;
  }

  const flattenedVariants = flattenConnection(variants ?? {});

  if (flattenedVariants.length) {
    const firstVariant = flattenedVariants[0];
    firstVariantPrice = firstVariant?.priceV2;

    if (firstVariant && firstVariant.sku) {
      productSchema.sku = firstVariant.sku;
    }

    productSchema.offers = flattenedVariants.map((node) => {
      if (!node || !node.priceV2?.amount || !node.priceV2.currencyCode) {
        throw new Error(
          `<ProductSeo/> requires variant.PriceV2 'amount' and 'currency`
        );
      }
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
