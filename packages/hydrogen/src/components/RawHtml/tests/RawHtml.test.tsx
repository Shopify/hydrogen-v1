import React from 'react';
import {mount} from '@shopify/react-testing';

import {RawHtml} from '../RawHtml';

describe('<RawHtml />', () => {
  it('renders a `div` with dangerously set inner HTML', () => {
    const component = mount(<RawHtml string="<p>Hello, World.</p>" />);
    expect(component).toContainReactComponent('div', {
      dangerouslySetInnerHTML: {
        __html: '<p>Hello, World.</p>',
      },
    });
  });

  it('allows pass-through props', () => {
    const component = mount(
      <RawHtml className="paragraph" string="<p>Hello, World.</p>" />
    );
    expect(component).toHaveReactProps({className: 'paragraph'});
  });

  it('renders the element corresponding to the `as` prop', () => {
    const component = mount(<RawHtml as="p" string="<p>Hello, World.</p>" />);

    expect(component).toContainReactComponent('p', {
      dangerouslySetInnerHTML: {
        __html: '<p>Hello, World.</p>',
      },
    });
  });
});
