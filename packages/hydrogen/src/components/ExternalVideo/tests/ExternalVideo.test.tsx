import React from 'react';
import {mount} from '@shopify/react-testing';
import {ExternalVideo} from '../ExternalVideo';
import {getExternalVideoData} from '../../../utilities/tests/media';

describe('<ExternalVideo />', () => {
  it('renders an iframe element with sensible defaults', () => {
    const video = getExternalVideoData();
    const component = mount(<ExternalVideo data={video} />);

    expect(component).toContainReactComponent('iframe', {
      src: video.embeddedUrl,
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
          embeddedUrl: 'https://www.youtube.com/embed/a2YSgfwXc9c',
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

  it('transforms a valid youtube shortened url to an embed compatibile url', () => {
    const invalidUrl = 'https://youtu.be/a2YSgfwXc9c';
    const validUrl = invalidUrl.replace(/youtu\.be/, 'www.youtube.com/embed');
    const component = mount(
      <ExternalVideo
        data={getExternalVideoData({
          embeddedUrl: invalidUrl,
        })}
      />
    );
    expect(component).toContainReactComponent('iframe', {
      src: validUrl,
    });
  });
});
