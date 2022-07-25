import React from 'react';
import {mount} from '@shopify/react-testing';
import {ExternalVideo} from '../index.js';
import {getExternalVideoData} from '../../../utilities/tests/media.js';

describe('<ExternalVideo />', () => {
  it('renders an iframe element with sensible defaults', () => {
    const video = getExternalVideoData();
    const component = mount(<ExternalVideo data={video} />);

    expect(component).toContainReactComponent('iframe', {
      src: video.embedUrl,
      id: video.id,
      allow:
        'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
      allowFullScreen: true,
      frameBorder: '0',
    });
  });

  it('allows defaults to be overridden', () => {
    const component = mount(
      <ExternalVideo
        data={getExternalVideoData()}
        id="hello"
        allow="autoplay"
        allowFullScreen={false}
        frameBorder="1"
      />
    );

    expect(component).toContainReactComponent('iframe', {
      id: 'hello',
      allow: 'autoplay',
      allowFullScreen: false,
      frameBorder: '1',
    });
  });

  it('includes options in the iframe src when the `options` prop is provided', () => {
    const options = {
      color: 'red',
      autoplay: true,
    };
    const component = mount(
      <ExternalVideo
        data={getExternalVideoData({
          embedUrl: 'https://www.youtube.com/embed/a2YSgfwXc9c',
        })}
        options={options}
      />
    );

    expect(component).toContainReactComponent('iframe', {
      src: 'https://www.youtube.com/embed/a2YSgfwXc9c?&color=red&autoplay=true',
    });
  });

  it('allows passthrough props', () => {
    const component = mount(
      <ExternalVideo data={getExternalVideoData()} className="fancy" />
    );

    expect(component).toContainReactComponent('iframe', {
      className: 'fancy',
    });
  });

  describe(`throws when necessary props aren't passed`, () => {
    it(`data.embedUrl`, () => {
      // to silence the test runner's console.error from being called
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      expect(() => mount(<ExternalVideo data={{id: 'hi'}} />)).toThrow();
      expect(console.error).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
