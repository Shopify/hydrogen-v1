import {getVideoData} from './Video.test.helpers.js';
import {getExternalVideoData} from './ExternalVideo.test.helpers.js';
import {faker} from '@faker-js/faker';
import type {PartialDeep} from 'type-fest';
import type {MediaImage, MediaEdge} from './storefront-api-types.js';
import {getPreviewImage} from './Image.test.helpers.js';
import {getModel3d} from './ModelViewer.test.helpers.js';

export function getMedia(
  type?: MediaEdge['node']['__typename']
): PartialDeep<MediaEdge['node']> {
  const finalType: MediaEdge['node']['__typename'] =
    type ??
    faker.helpers.arrayElement<MediaEdge['node']['__typename']>([
      'ExternalVideo',
      'MediaImage',
      'Model3d',
      'Video',
    ]);

  switch (finalType) {
    case 'MediaImage': {
      return {
        __typename: 'MediaImage',
        ...getMediaImage({
          previewImage: {
            url: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/products/Main.jpg',
            width: 500,
            height: 500,
          },
        }),
      };
    }
    case 'Video': {
      return {
        __typename: 'Video',
        ...getVideoData({
          sources: [
            {
              url: 'https://cdn.shopify.com/videos/c/vp/3a5f8892328346dab437721e9ff007ad/3a5f8892328346dab437721e9ff007ad.m3u8',
              mimeType: 'application/x-mpegURL',
            },
            {
              url: 'https://cdn.shopify.com/videos/c/vp/3a5f8892328346dab437721e9ff007ad/3a5f8892328346dab437721e9ff007ad.HD-1080p-7.2Mbps.mp4',
              mimeType: 'video/mp4',
            },
          ],
        }),
      };
    }
    case 'ExternalVideo': {
      return {
        __typename: 'ExternalVideo',
        ...getExternalVideoData({
          embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          host: 'YOUTUBE',
        }),
      };
    }
    case 'Model3d': {
      return {
        __typename: 'Model3d',
        ...getModel3d({
          sources: [
            {
              url: 'https://model3d.shopifycdn.com/models/o/eea3c66a77368d9a/snowboard.glb',
            },
          ],
          previewImage: {
            url: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/products/Main.jpg?v=1655932274&width=1600&height=1600&crop=center',
          },
        }),
      };
    }
    default: {
      throw new Error(`Did not pass in a correct value for 'type'`);
    }
  }
}

export function getMediaImage(
  image: PartialDeep<MediaImage> = {}
): PartialDeep<MediaImage> {
  return {
    id: image.id ?? faker.random.words(),
    mediaContentType: 'IMAGE',
    image: getPreviewImage(image.previewImage ?? undefined),
  };
}
