import React from 'react';
import {mount} from '@shopify/react-testing';
import {RawHtml} from '../RawHtml';
import {Link} from '../../Link/index';

describe('<RawHtml />', () => {
  it('renders a `div` with dangerously set inner HTML', () => {
    const component = mount(
      <RawHtml dangerouslySetInnerHTMLString="<p>Hello, World.</p>" />
    );
    expect(component).toContainReactComponent('div', {
      dangerouslySetInnerHTML: {
        __html: '<p>Hello, World.</p>',
      },
    });
  });

  it('allows pass-through props', () => {
    const component = mount(
      <RawHtml
        className="paragraph"
        dangerouslySetInnerHTMLString="<p>Hello, World.</p>"
      />
    );
    expect(component).toHaveReactProps({className: 'paragraph'});
  });

  it('renders the element corresponding to the `as` prop', () => {
    const component = mount(
      <RawHtml as="p" dangerouslySetInnerHTMLString="<p>Hello, World.</p>" />
    );

    expect(component).toContainReactComponent('p', {
      dangerouslySetInnerHTML: {
        __html: '<p>Hello, World.</p>',
      },
    });
  });

  it(`validates props when a component is passed to the 'as' prop`, () => {
    const component = mount(
      <RawHtml
        as={Link}
        to="/test"
        dangerouslySetInnerHTMLString="<p>Hello, World.</p>"
      />
    );

    expect(component).toContainReactComponent(Link, {
      to: '/test',
    });
  });
});
