import {
  MediaContentType,
  MediaImage,
  Image,
  Video,
  ExternalVideo,
  MediaHost,
  Model3d,
} from '../../storefront-api-types.js';
import faker from 'faker';
import type {PartialDeep} from 'type-fest';

export function getMediaImage(image: PartialDeep<MediaImage> = {}) {
  return {
    id: image.id ?? faker.random.words(),
    mediaContentType: MediaContentType.Image,
    image: getPreviewImage(image.previewImage ?? undefined),
  };
}

export function getPreviewImage(image: Partial<Image> = {}) {
  return {
    id: image.id ?? faker.random.words(),
    altText: image.altText ?? faker.random.words(),
    url: image.url ?? faker.random.image(),
    width: image.width ?? faker.datatype.number(),
    height: image.height ?? faker.datatype.number(),
    originalSrc: '',
    transformedSrc: '',
    src: '',
  };
}

export function getVideoData(video: Partial<Video> = {}) {
  return {
    id: video.id ?? faker.random.words(),
    mediaContentType: MediaContentType.Video,
    previewImage: getPreviewImage(video.previewImage ?? undefined),
    sources: video.sources ?? [
      {mimeType: faker.system.mimeType(), url: faker.internet.url()},
      {mimeType: faker.system.mimeType(), url: faker.internet.url()},
    ],
  };
}

export function getExternalVideoData(
  externalVideo: Partial<ExternalVideo> = {}
) {
  return {
    id: externalVideo.id ?? faker.random.words(),
    mediaContentType: MediaContentType.ExternalVideo,
    embedUrl: externalVideo.embedUrl ?? faker.internet.url(),
    host:
      externalVideo.host ?? faker.datatype.number({max: 2, min: 1}) === 1
        ? MediaHost.Youtube
        : MediaHost.Vimeo,
    previewImage: getPreviewImage(externalVideo.previewImage ?? undefined),
  };
}

export function getModel3d(model: Partial<Model3d> = {}) {
  return {
    id: model.id ?? faker.random.words(),
    mediaContentType: MediaContentType.Model_3D,
    alt: model.alt ?? faker.random.words(),
    previewImage: getPreviewImage(model.previewImage ?? undefined),
    sources: model.sources ?? [
      {url: faker.internet.url()},
      {url: faker.internet.url()},
    ],
  };
}

export function getAnyMedia() {
  const number = faker.datatype.number({max: 4, min: 1});

  switch (number) {
    case 1: {
      return getMediaImage();
    }
    case 2: {
      return getVideoData();
    }
    case 3: {
      return getExternalVideoData();
    }
    case 4: {
      return getModel3d();
    }
  }
}
