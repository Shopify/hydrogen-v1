import React from 'react';
import {mount} from '@shopify/react-testing';
import {TwitterSeo} from '../TwitterSeo.client.js';

jest.mock('../../../foundation/Head/Head.client', () => ({
  Head({children}: {children: React.ReactNode}) {
    return children;
  },
}));

describe('<TwitterSeo />', () => {
  it("renders <meta/> with name='twitter:card' by default", () => {
    const wrapper = mount(<TwitterSeo />);

    expect(wrapper).toContainReactComponent('meta', {
      name: 'twitter:card',
      content: 'summary_large_image',
    });
  });

  it("renders <meta/> with name='twitter:site' and content from site prop", () => {
    const wrapper = mount(<TwitterSeo site="site content" />);

    expect(wrapper).toContainReactComponent('meta', {
      name: 'twitter:site',
      content: 'site content',
    });
  });

  it("does not renders <meta/> with name='twitter:site' when site prop does not exist", () => {
    const wrapper = mount(<TwitterSeo />);

    expect(wrapper).not.toContainReactComponent('meta', {
      name: 'twitter:site',
    });
  });

  it("renders <meta/> with name='twitter:title' and content from title prop", () => {
    const wrapper = mount(<TwitterSeo title="title content" />);

    expect(wrapper).toContainReactComponent('meta', {
      name: 'twitter:title',
      content: 'title content',
    });
  });

  it("does not renders <meta/> with name='twitter:title' when title prop does not exist", () => {
    const wrapper = mount(<TwitterSeo />);

    expect(wrapper).not.toContainReactComponent('meta', {
      name: 'twitter:title',
    });
  });

  it("renders <meta/> with name='twitter:description' and content from description prop", () => {
    const wrapper = mount(<TwitterSeo description="description content" />);

    expect(wrapper).toContainReactComponent('meta', {
      name: 'twitter:description',
      content: 'description content',
    });
  });

  it("does not renders <meta/> with name='twitter:title' when description prop does not exist", () => {
    const wrapper = mount(<TwitterSeo />);

    expect(wrapper).not.toContainReactComponent('meta', {
      name: 'twitter:description',
    });
  });
});
