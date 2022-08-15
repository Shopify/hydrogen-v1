import * as React from 'react';
import {render, screen} from '@testing-library/react';
import {ExternalVideo} from '../index.js';
import {vi} from 'vitest';
import {getExternalVideoData} from '../../../utilities/tests/media.js';

const testId = 'video-iframe';

describe('<ExternalVideo />', () => {
  it('renders an iframe element with sensible defaults', () => {
    const video = getExternalVideoData();
    render(<ExternalVideo data={video} data-testid={testId} />);

    const videoEl = screen.getByTestId(testId);

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
        data-testid={testId}
        data={getExternalVideoData()}
        id="hello"
        allow="autoplay"
        allowFullScreen={false}
        frameBorder="1"
      />
    );

    const videoEl = screen.getByTestId(testId);

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
        data-testid={testId}
        data={getExternalVideoData({
          embedUrl: 'https://www.youtube.com/embed/a2YSgfwXc9c',
        })}
        options={options}
      />
    );

    const videoEl = screen.getByTestId(testId);

    expect(videoEl).toHaveAttribute(
      'src',
      'https://www.youtube.com/embed/a2YSgfwXc9c?&color=red&autoplay=true'
    );
  });

  it('allows passthrough props', () => {
    render(
      <ExternalVideo
        data={getExternalVideoData()}
        className="fancy"
        data-testid={testId}
      />
    );

    const videoEl = screen.getByTestId(testId);

    expect(videoEl).toHaveAttribute('class', 'fancy');
  });

  it(`throws when 'data.embedUrl' isn't passed`, () => {
    // to silence the test runner's console.error from being called
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ExternalVideo data={{id: 'hi'}} />)).toThrow();
    expect(console.error).toHaveBeenCalled();
  });
});
