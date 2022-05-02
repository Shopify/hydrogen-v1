import {render, screen} from '@testing-library/react';
import {Video} from './Video';

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
    render(<Video data={VIDEO_PROPS} />);
    const video = screen.getByTestId('video');

    expect(video).toHaveAttribute('id', VIDEO_PROPS.id);
    expect(video).toHaveAttribute('poster', VIDEO_PROPS.previewImage.url);
    expect(video).toHaveAttribute('playsinline');
    expect(video).toHaveAttribute('controls');
  });

  it('renders source tags for each source', () => {
    render(<Video data={VIDEO_PROPS} />);
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
    render(<Video data={VIDEO_PROPS} className="testClass" />);
    const video = screen.getByTestId('video');

    expect(video).toHaveAttribute('class', 'testClass');
  });
});
