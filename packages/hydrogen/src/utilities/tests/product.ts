import faker from 'faker';
import {getPrice} from './price.js';
import {getUnitPriceMeasurement} from './unitPriceMeasurement.js';
import {getAnyMedia, getPreviewImage} from './media.js';
import {
  ProductVariant,
  Product as ProductType,
} from '../../storefront-api-types.js';
import {getRawMetafield} from './metafields.js';
import type {PartialDeep} from 'type-fest';

export function getProduct(
  product: PartialDeep<ProductType> = {}
): PartialDeep<ProductType> {
  return {
    id: product.id ?? faker.datatype.uuid(),
    handle: product.handle ?? faker.random.word(),
    title: product.title ?? faker.random.words(),
    descriptionHtml:
      product.descriptionHtml ?? `<p>${faker.random.words()}</p>`,
    priceRange: {
      maxVariantPrice: getPrice(product.priceRange?.maxVariantPrice),
      minVariantPrice: getPrice(product.priceRange?.minVariantPrice),
    },
    compareAtPriceRange: {
      maxVariantPrice: getPrice(product.compareAtPriceRange?.maxVariantPrice),
      minVariantPrice: getPrice(product.compareAtPriceRange?.minVariantPrice),
    },
    media: product.media ?? {
      nodes: [
        getAnyMedia(),
        getAnyMedia(),
        getAnyMedia(),
        getAnyMedia(),
        getAnyMedia(),
      ],
    },
    variants: product.variants ?? {
      nodes: [
        getVariant(),
        getVariant(),
        getVariant(),
        getVariant(),
        getVariant(),
        getVariant(),
        getVariant(),
      ],
    },
    metafields: product.metafields ?? [
      getRawMetafield(),
      getRawMetafield(),
      getRawMetafield(),
    ],
    sellingPlanGroups: product.sellingPlanGroups ?? {nodes: []},
  };
}

export function getVariant(
  variant: PartialDeep<ProductVariant> = {}
): PartialDeep<ProductVariant> {
  return {
    id: variant.id ?? faker.random.words(),
    title: variant.title ?? faker.random.words(),
    availableForSale: variant.availableForSale ?? faker.datatype.boolean(),
    image: getPreviewImage(variant?.image ?? undefined),
    unitPrice: getPrice(variant?.unitPrice ?? undefined),
    unitPriceMeasurement: getUnitPriceMeasurement(
      variant?.unitPriceMeasurement ?? undefined
    ),
    priceV2: getPrice(variant.priceV2),
    compareAtPriceV2: getPrice(variant?.compareAtPriceV2 ?? undefined),
    selectedOptions: [
      {name: faker.random.word(), value: faker.random.word()},
      {name: faker.random.word(), value: faker.random.word()},
    ],
    // @ts-expect-error until we mock out a selling plan, TS will complain here
    sellingPlanAllocations: [],
    metafields: variant.metafields ?? [
      getRawMetafield(),
      getRawMetafield(),
      getRawMetafield(),
    ],
  };
}
