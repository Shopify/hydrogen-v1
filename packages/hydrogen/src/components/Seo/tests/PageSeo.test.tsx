import React from 'react';

import {mount} from '@shopify/react-testing';

import {PageSeo} from '../PageSeo.client.js';
import {TitleSeo} from '../TitleSeo.client.js';
import {DescriptionSeo} from '../DescriptionSeo.client.js';
import {TwitterSeo} from '../TwitterSeo.client.js';

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

jest.mock('../TwitterSeo.client', () => ({
  TwitterSeo() {
    return null;
  },
}));

describe('<PageSeo />', () => {
  describe('title prop', () => {
    it('renders <TitleSeo /> with title prop', () => {
      const wrapper = mount(<PageSeo title="fallbackTitle" seo={{}} />);

      expect(wrapper).toContainReactComponent(TitleSeo, {
        title: 'fallbackTitle',
      });
    });

    it('renders <TwitterSeo /> with title prop', () => {
      const wrapper = mount(<PageSeo title="fallbackTitle" seo={{}} />);

      expect(wrapper).toContainReactComponent(TwitterSeo, {
        title: 'fallbackTitle',
      });
    });
  });

  describe('seo title prop', () => {
    it('renders <TitleSeo /> with seo title prop', () => {
      const wrapper = mount(
        <PageSeo title="fallbackTitle" seo={{title: 'seoTitle'}} />
      );

      expect(wrapper).toContainReactComponent(TitleSeo, {
        title: 'seoTitle',
      });
    });

    it('renders <TwitterSeo /> with seo title prop', () => {
      const wrapper = mount(
        <PageSeo title="fallbackTitle" seo={{title: 'seoTitle'}} />
      );

      expect(wrapper).toContainReactComponent(TwitterSeo, {
        title: 'seoTitle',
      });
    });
  });

  describe('seo description prop', () => {
    it('renders <DescriptionSeo /> with seo description prop', () => {
      const wrapper = mount(
        <PageSeo title="" seo={{description: 'seoDescription'}} />
      );

      expect(wrapper).toContainReactComponent(DescriptionSeo, {
        description: 'seoDescription',
      });
    });

    it('renders <TwitterSeo /> with seo description prop', () => {
      const wrapper = mount(
        <PageSeo title="" seo={{description: 'seoDescription'}} />
      );

      expect(wrapper).toContainReactComponent(TwitterSeo, {
        description: 'seoDescription',
      });
    });
  });
});
