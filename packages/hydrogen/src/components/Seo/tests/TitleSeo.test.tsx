import React from 'react';

import {mount} from '@shopify/react-testing';

import {TitleSeo} from '../TitleSeo.client.js';

jest.mock('../../../foundation/Head/Head.client', () => ({
  Head({children}: {children: React.ReactNode}) {
    return children;
  },
}));

describe('<TitleSeo />', () => {
  it('renders null if title prop does not exist', () => {
    const wrapper = mount(<TitleSeo />);

    expect(wrapper?.children.length).toBe(0);
  });

  it('renders <title/> with title prop as content', () => {
    const wrapper = mount(<TitleSeo title="title content" />);

    expect(wrapper).toContainReactComponent('title', {
      children: 'title content',
    });
  });

  it("renders <meta/> property='og:title' and content from title prop", () => {
    const wrapper = mount(<TitleSeo title="title content" />);

    expect(wrapper).toContainReactComponent('meta', {
      property: 'og:title',
      content: 'title content',
    });
  });
});
