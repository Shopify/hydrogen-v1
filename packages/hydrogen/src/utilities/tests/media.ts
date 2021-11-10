import {
  MediaContentType,
  MediaImage,
  Image,
  Video,
  ExternalVideo,
  MediaHost,
  Model3d,
} from '../../graphql/types/types';
// eslint-disable-next-line node/no-extraneous-import
import faker from 'faker';

export function getMediaImage(image: Partial<MediaImage> = {}) {
  return {
    id: image.id ?? faker.random.words(),
    mediaContentType: MediaContentType.Image,
    image: getPreviewImage(image.previewImage),
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

export function getVideo(video: Partial<Video> = {}) {
  return {
    id: video.id ?? faker.random.words(),
    mediaContentType: MediaContentType.Video,
    previewImage: getPreviewImage(video.previewImage),
    sources: video.sources ?? [
      {mimeType: faker.system.mimeType(), url: faker.internet.url()},
      {mimeType: faker.system.mimeType(), url: faker.internet.url()},
    ],
  };
}

export function getExternalVideo(externalVideo: Partial<ExternalVideo> = {}) {
  return {
    id: externalVideo.id ?? faker.random.words(),
    mediaContentType: MediaContentType.ExternalVideo,
    embeddedUrl: externalVideo.embeddedUrl ?? faker.internet.url(),
    host:
      externalVideo.host ?? faker.datatype.number({max: 2, min: 1}) === 1
        ? MediaHost.Youtube
        : MediaHost.Vimeo,
    previewImage: getPreviewImage(externalVideo.previewImage),
  };
}

export function getModel3d(model: Partial<Model3d> = {}) {
  return {
    id: model.id ?? faker.random.words(),
    mediaContentType: MediaContentType.Model_3D,
    alt: model.alt ?? faker.random.words(),
    previewImage: getPreviewImage(model.previewImage),
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
      return getVideo();
    }
    case 3: {
      return getExternalVideo();
    }
    case 4: {
      return getModel3d();
    }
  }
}
