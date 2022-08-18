import type {Story} from '@ladle/react';
import {ExternalVideo, type ExternalVideoProps} from './ExternalVideo.js';

import {PartialDeep} from 'type-fest';
import type {
  ExternalVideo as ExternalVideoType,
  Image,
} from './storefront-api-types.js';
import {faker} from '@faker-js/faker';

const Template: Story<ExternalVideoProps> = (props) => (
  <ExternalVideo {...props} />
);

export const Youtube = Template.bind({});
Youtube.args = {
  data: getExternalVideoData({
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    host: 'YOUTUBE',
  }),
};

export const Vimeo = Template.bind({});
Vimeo.args = {
  data: getExternalVideoData({
    embedUrl: 'https://player.vimeo.com/video/375468729?h=d063a6fe74',
    host: 'VIMEO',
  }),
};

function getExternalVideoData(
  externalVideo: Partial<ExternalVideoType> = {}
): PartialDeep<ExternalVideoType> {
  return {
    id: externalVideo.id ?? faker.random.words(),
    mediaContentType: 'EXTERNAL_VIDEO',
    embedUrl: externalVideo.embedUrl ?? faker.internet.url(),
    host:
      externalVideo.host ?? faker.datatype.number({max: 2, min: 1}) === 1
        ? 'YOUTUBE'
        : 'VIMEO',
    previewImage: getPreviewImage(externalVideo.previewImage ?? undefined),
  };
}

function getPreviewImage(image: Partial<Image> = {}) {
  return {
    id: image.id ?? faker.random.words(),
    altText: image.altText ?? faker.random.words(),
    url: image.url ?? faker.image.image(),
    width: image.width ?? faker.datatype.number(),
    height: image.height ?? faker.datatype.number(),
    originalSrc: '',
    transformedSrc: '',
    src: '',
  };
}
