import {faker} from '@faker-js/faker';
import type {Image as ImageType} from './storefront-api-types.js';
import type {PartialDeep} from 'type-fest';

export function getPreviewImage(
  image: Partial<ImageType> = {}
): PartialDeep<ImageType> & {
  url: ImageType['url'];
} {
  return {
    id: image.id ?? faker.random.words(),
    altText: image.altText ?? faker.random.words(),
    url: image.url ?? faker.image.imageUrl(),
    width: image.width ?? faker.datatype.number(),
    height: image.height ?? faker.datatype.number(),
    originalSrc: '',
    transformedSrc: '',
    src: '',
  };
}
