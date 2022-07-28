import React from 'react';

import {mount} from '@shopify/react-testing';

import {DescriptionSeo} from '../DescriptionSeo.client.js';

jest.mock('../../../foundation/Head/Head.client', () => ({
  Head({children}: {children: React.ReactNode}) {
    return children;
  },
}));

describe('<DescriptionSeo />', () => {
  it('renders null if title prop does not exist', () => {
    const wrapper = mount(<DescriptionSeo />);

    expect(wrapper?.children.length).toBe(0);
  });

  it("renders <meta/> name='og:title' and content from description prop", () => {
    const wrapper = mount(<DescriptionSeo description="description content" />);

    expect(wrapper).toContainReactComponent('meta', {
      name: 'description',
      content: 'description content',
    });
  });

  it("renders <meta/> property='og:description' and content from description prop", () => {
    const wrapper = mount(<DescriptionSeo description="description content" />);

    expect(wrapper).toContainReactComponent('meta', {
      property: 'og:description',
      content: 'description content',
    });
  });
});
