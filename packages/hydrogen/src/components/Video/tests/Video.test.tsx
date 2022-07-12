import {mount} from '@shopify/react-testing';
import {Video} from '../index.js';

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
    const video = mount(<Video data={VIDEO_PROPS} />);

    expect(video).toContainReactComponent('video', {
      id: VIDEO_PROPS.id,
      poster: VIDEO_PROPS.previewImage.url,
      playsInline: true,
      controls: true,
    });
  });

  it('renders source tags for each source', () => {
    const video = mount(<Video data={VIDEO_PROPS} />);

    expect(video).toContainReactComponentTimes('source', 2);
    expect(
      video.find('source', {
        src: VIDEO_PROPS.sources[0].url,
        type: VIDEO_PROPS.sources[0].mimeType,
      })
    ).toBeDefined();
    expect(
      video.find('source', {
        src: VIDEO_PROPS.sources[1].url,
        type: VIDEO_PROPS.sources[1].mimeType,
      })
    ).toBeDefined();
  });

  it('allows passthrough props', () => {
    const video = mount(<Video data={VIDEO_PROPS} className="testClass" />);

    expect(video).toContainReactComponent('video', {
      className: 'testClass',
    });
  });
});
