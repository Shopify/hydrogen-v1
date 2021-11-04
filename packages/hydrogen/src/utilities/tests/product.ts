// eslint-disable-next-line node/no-extraneous-import
import faker from 'faker';
import {getPrice} from './price';
import {getUnitPriceMeasurement} from './unitPriceMeasurement';
import {getAnyMedia, getPreviewImage} from './media';
import {ProductVariant} from '../../graphql/types/types';
import {ProductProviderFragmentFragment} from '../../components/ProductProvider/ProductProviderFragment';
import {getRawMetafield} from './metafields';

export function getProduct(
  product: Partial<ProductProviderFragmentFragment> = {}
) {
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
      edges: [
        {node: getAnyMedia()},
        {node: getAnyMedia()},
        {node: getAnyMedia()},
        {node: getAnyMedia()},
        {node: getAnyMedia()},
        {node: getAnyMedia()},
      ],
    },
    variants: product.variants ?? {
      edges: [
        {node: getVariant()},
        {node: getVariant()},
        {node: getVariant()},
        {node: getVariant()},
        {node: getVariant()},
        {node: getVariant()},
        {node: getVariant()},
      ],
    },
    metafields: product.metafields ?? {
      edges: [
        {node: getRawMetafield()},
        {node: getRawMetafield()},
        {node: getRawMetafield()},
      ],
    },
  };
}

export function getVariant(variant: Partial<ProductVariant> = {}) {
  return {
    id: variant.id ?? faker.random.words(),
    title: variant.title ?? faker.random.words(),
    availableForSale: variant.availableForSale ?? faker.datatype.boolean(),
    image: getPreviewImage(variant.image),
    unitPrice: getPrice(variant.unitPrice),
    unitPriceMeasurement: getUnitPriceMeasurement(variant.unitPriceMeasurement),
    priceV2: getPrice(variant.priceV2),
    compareAtPriceV2: getPrice(variant.compareAtPriceV2),
    selectedOptions: [
      {name: faker.random.word(), value: faker.random.word()},
      {name: faker.random.word(), value: faker.random.word()},
    ],
    metafields: variant.metafields ?? {
      edges: [
        {node: getRawMetafield()},
        {node: getRawMetafield()},
        {node: getRawMetafield()},
      ],
    },
  };
}
