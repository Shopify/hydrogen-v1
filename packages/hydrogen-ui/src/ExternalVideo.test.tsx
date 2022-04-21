import {render, screen} from '@testing-library/react';
import {PartialDeep} from 'type-fest';
import {
  ExternalVideo as ExternalVideoType,
  Image,
  MediaHost,
  MediaContentType,
} from '../../hydrogen/src/storefront-api-types';
import {ExternalVideo} from './ExternalVideo';
import {faker} from '@faker-js/faker';
import * as React from 'react';
import {vi} from 'vitest';

describe('<ExternalVideo />', () => {
  it('renders an iframe element with sensible defaults', () => {
    const video = getExternalVideoData();
    render(<ExternalVideo data={video} />);

    const videoEl = screen.getByTestId('video-iframe');

    expect(videoEl).toBeInTheDocument();

    expect(videoEl).toHaveAttribute('src', video.embedUrl);
    expect(videoEl).toHaveAttribute('id', video.id);
    expect(videoEl).toHaveAttribute(
      'allow',
      'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
    );
    expect(videoEl).toHaveAttribute('allowfullscreen');
    expect(videoEl).toHaveAttribute('frameborder', '0');
  });

  it('allows defaults to be overridden', () => {
    render(
      <ExternalVideo
        data={getExternalVideoData()}
        id="hello"
        allow="autoplay"
        allowFullScreen={false}
        frameBorder="1"
      />
    );

    const videoEl = screen.getByTestId('video-iframe');

    expect(videoEl).toHaveAttribute('id', 'hello');
    expect(videoEl).toHaveAttribute('allow', 'autoplay');
    expect(videoEl).not.toHaveAttribute('allowfullscreen');
    expect(videoEl).toHaveAttribute('frameborder', '1');
  });

  it('includes options in the iframe src when the `options` prop is provided', () => {
    const options = {
      color: 'red',
      autoplay: true,
    };
    render(
      <ExternalVideo
        data={getExternalVideoData({
          embedUrl: 'https://www.youtube.com/embed/a2YSgfwXc9c',
        })}
        options={options}
      />
    );

    const videoEl = screen.getByTestId('video-iframe');

    expect(videoEl).toHaveAttribute(
      'src',
      'https://www.youtube.com/embed/a2YSgfwXc9c?&color=red&autoplay=true'
    );
  });

  it('allows passthrough props', () => {
    render(<ExternalVideo data={getExternalVideoData()} className="fancy" />);

    const videoEl = screen.getByTestId('video-iframe');

    expect(videoEl).toHaveAttribute('class', 'fancy');
  });

  it(`throws when 'data.embedUrl' isn't passed`, () => {
    // to silence the test runner's console.error from being called
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ExternalVideo data={{id: 'hi'}} />)).toThrow();
    expect(console.error).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

export function getExternalVideoData(
  externalVideo: Partial<ExternalVideoType> = {}
): PartialDeep<ExternalVideoType> {
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

// will move this into Image.test.tsx when it's moved into h-ui
export function getPreviewImage(image: Partial<Image> = {}) {
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
