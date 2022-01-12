import React from 'react';
import {mount} from '@shopify/react-testing';
import {ExternalVideo} from '../ExternalVideo';
import {getExternalVideo} from '../../../utilities/tests/media';

describe('<ExternalVideo />', () => {
  it('renders an iframe element with sensible defaults', () => {
    const video = getExternalVideo();
    const component = mount(<ExternalVideo video={video} />);

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
        video={getExternalVideo()}
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
        video={getExternalVideo({
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
      <ExternalVideo video={getExternalVideo()} className="fancy" />
    );

    expect(component).toContainReactComponent('iframe', {
      className: 'fancy',
    });
  });
});
