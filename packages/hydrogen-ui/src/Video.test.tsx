import * as React from 'react';
import {render, screen} from '@testing-library/react';
import {Video} from './Video.js';
import type {Video as VideoType, VideoSource} from './storefront-api-types.js';
import {faker} from '@faker-js/faker';
import type {PartialDeep} from 'type-fest';
import {getPreviewImage} from './Image.test.helpers.js';

const VIDEO_PROPS = {
  id: 'video',
  previewImage: {
    url: 'http://www.example.com/shopify.png',
  },
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
};

describe('<Video />', () => {
  it('renders a video tag', () => {
    render(<Video data={VIDEO_PROPS} data-testId="video" />);
    const video = screen.getByTestId('video');

    expect(video).toHaveAttribute('id', VIDEO_PROPS.id);
    expect(video).toHaveAttribute('poster', VIDEO_PROPS.previewImage.url);
    expect(video).toHaveAttribute('playsinline');
    expect(video).toHaveAttribute('controls');
  });

  it('renders source tags for each source', () => {
    render(
      <Video data={VIDEO_PROPS} sourceProps={{'data-testid': 'video-screen'}} />
    );
    const screens = screen.getAllByTestId('video-screen');

    expect(screens.length).toBe(2);

    screens.forEach((screen, index) => {
      expect(screen).toHaveAttribute('src', VIDEO_PROPS.sources[index].url);
      expect(screen).toHaveAttribute(
        'type',
        VIDEO_PROPS.sources[index].mimeType
      );
    });
  });

  it('allows passthrough props', () => {
    render(
      <Video data={VIDEO_PROPS} className="testClass" data-testId="video" />
    );
    const video = screen.getByTestId('video');

    expect(video).toHaveAttribute('class', 'testClass');
  });
});

export function getVideoData(
  video: Partial<VideoType> = {}
): PartialDeep<VideoType> {
  return {
    id: video.id ?? faker.random.words(),
    mediaContentType: 'VIDEO',
    previewImage: getPreviewImage(video.previewImage ?? undefined),
    sources: video.sources ?? getVideoSources(),
  };
}

function getVideoSources(): Partial<VideoSource>[] {
  return [
    {mimeType: faker.system.mimeType(), url: faker.internet.url()},
    {mimeType: faker.system.mimeType(), url: faker.internet.url()},
  ];
}
