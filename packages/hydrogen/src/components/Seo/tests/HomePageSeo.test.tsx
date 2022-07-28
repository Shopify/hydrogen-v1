import React from 'react';

import {mount} from '@shopify/react-testing';

import {HomePageSeo} from '../HomePageSeo.client.js';
import {TitleSeo} from '../TitleSeo.client.js';
import {DescriptionSeo} from '../DescriptionSeo.client.js';

jest.mock('../../../foundation/Head/Head.client', () => ({
  Head({children}: {children: React.ReactNode}) {
    return children;
  },
}));

jest.mock('../TitleSeo.client', () => ({
  TitleSeo() {
    return null;
  },
}));

jest.mock('../DescriptionSeo.client', () => ({
  DescriptionSeo() {
    return null;
  },
}));

const defaultProps = {
  title: 'default title',
  url: 'https://test.com',
  description: 'cool product',
};

describe('<HomePageSeo />', () => {
  it("renders <meta/> with property='og:url' and url prop", () => {
    const wrapper = mount(<HomePageSeo {...defaultProps} />);

    expect(wrapper).toContainReactComponent('meta', {
      property: 'og:url',
      content: defaultProps.url,
    });
  });

  it('renders <script/> with organization schema as contente', () => {
    const organizationSchema = {
      '@context': 'http://schema.org',
      '@type': 'Organization',
      name: defaultProps.title,
      url: defaultProps.url,
    };
    const wrapper = mount(<HomePageSeo {...defaultProps} />);

    expect(wrapper).toContainReactComponent('script', {
      type: 'application/ld+json',
      children: JSON.stringify(organizationSchema),
    });
  });

  it('renders <script/> with webSite schema as contente', () => {
    const webSiteSchema = {
      '@context': 'http://schema.org',
      '@type': 'WebSite',
      name: defaultProps.title,
      url: defaultProps.url,
    };
    const wrapper = mount(<HomePageSeo {...defaultProps} />);

    expect(wrapper).toContainReactComponent('script', {
      type: 'application/ld+json',
      children: JSON.stringify(webSiteSchema),
    });
  });

  it('renders <TitleSeo /> with title prop', () => {
    const wrapper = mount(<HomePageSeo {...defaultProps} />);

    expect(wrapper).toContainReactComponent(TitleSeo, {
      title: defaultProps.title,
    });
  });

  it('does not render <DescriptionSeo /> by default', () => {
    const wrapper = mount(<HomePageSeo {...defaultProps} description={null} />);

    expect(wrapper).not.toContainReactComponent(DescriptionSeo);
  });

  it('renders <DescriptionSeo /> with description prop', () => {
    const description = 'test description';
    const wrapper = mount(
      <HomePageSeo {...defaultProps} description={description} />
    );

    expect(wrapper).toContainReactComponent(DescriptionSeo, {
      description,
    });
  });
});
