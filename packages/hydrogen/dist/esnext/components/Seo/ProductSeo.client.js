import React from 'react';
import { Head } from '../../client';
import { TitleSeo } from './TitleSeo.client';
import { DescriptionSeo } from './DescriptionSeo.client';
import { TwitterSeo } from './TwitterSeo.client';
import { ImageSeo } from './ImageSeo.client';
import { flattenConnection } from '../../utilities';
export function ProductSeo({ url, title, description, seo, vendor, featuredImage, variants, }) {
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
    };
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
                throw new Error(`<ProductSeo/> requires variant.PriceV2 'amount' and 'currency`);
            }
            const offerSchema = {
                '@type': 'Offer',
                availability: `https://schema.org/${node.availableForSale ? 'InStock' : 'OutOfStock'}`,
                price: node.priceV2.amount,
                priceCurrency: node.priceV2.currencyCode,
            };
            if (node.sku) {
                offerSchema.sku = node.sku;
            }
            if (node.image && node.image.url) {
                offerSchema.image = node.image.url;
            }
            return offerSchema;
        });
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(Head, null,
            React.createElement("meta", { property: "og:type", content: "og:product" }),
            firstVariantPrice && (React.createElement("meta", { property: "og:price:amount", content: `${firstVariantPrice.amount}` })),
            firstVariantPrice && (React.createElement("meta", { property: "og:price:currency", content: firstVariantPrice.currencyCode })),
            React.createElement("script", { type: "application/ld+json" }, JSON.stringify(productSchema))),
        React.createElement(TitleSeo, { title: seoTitle }),
        React.createElement(DescriptionSeo, { description: seoDescription }),
        React.createElement(TwitterSeo, { title: seoTitle, description: seoDescription }),
        featuredImage && React.createElement(ImageSeo, { ...featuredImage })));
}
