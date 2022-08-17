import React from 'react';

import {mount} from '@shopify/react-testing';

import {CollectionSeo} from '../CollectionSeo.client.js';
import {TitleSeo} from '../TitleSeo.client.js';
import {DescriptionSeo} from '../DescriptionSeo.client.js';
import {TwitterSeo} from '../TwitterSeo.client.js';
import {ImageSeo} from '../ImageSeo.client.js';

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

jest.mock('../ImageSeo.client', () => ({
  ImageSeo() {
    return null;
  },
}));

jest.mock('../../../foundation/Head/Head.client', () => ({
  Head({children}: {children: React.ReactNode}) {
    return children;
  },
}));

const defaultProps = {
  title: 'default title',
  description: 'default description',
  seo: {},
};

describe('<CollectionSeo />', () => {
  describe('title prop', () => {
    it('renders <TitleSeo /> with title prop', () => {
      const wrapper = mount(<CollectionSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent(TitleSeo, {
        title: defaultProps.title,
      });
    });

    it('renders <TwitterSeo /> with title prop', () => {
      const wrapper = mount(<CollectionSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent(TwitterSeo, {
        title: defaultProps.title,
      });
    });
  });

  describe('description prop', () => {
    it('renders <DescriptionSeo /> with description prop', () => {
      const wrapper = mount(<CollectionSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent(DescriptionSeo, {
        description: defaultProps.description,
      });
    });

    it('renders <TwitterSeo /> with description prop', () => {
      const wrapper = mount(<CollectionSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent(TwitterSeo, {
        description: defaultProps.description,
      });
    });
  });

  describe('seo title prop', () => {
    it('renders <TitleSeo /> with seo title prop', () => {
      const wrapper = mount(
        <CollectionSeo {...defaultProps} seo={{title: 'seoTitle'}} />
      );

      expect(wrapper).toContainReactComponent(TitleSeo, {
        title: 'seoTitle',
      });
    });

    it('renders <TwitterSeo /> with seo title prop', () => {
      const wrapper = mount(
        <CollectionSeo {...defaultProps} seo={{title: 'seoTitle'}} />
      );

      expect(wrapper).toContainReactComponent(TwitterSeo, {
        title: 'seoTitle',
      });
    });
  });

  describe('seo description prop', () => {
    it('renders <DescriptionSeo /> with seo description prop', () => {
      const wrapper = mount(
        <CollectionSeo
          {...defaultProps}
          seo={{description: 'seoDescription'}}
        />
      );

      expect(wrapper).toContainReactComponent(DescriptionSeo, {
        description: 'seoDescription',
      });
    });

    it('renders <TwitterSeo /> with seo description prop', () => {
      const wrapper = mount(
        <CollectionSeo
          {...defaultProps}
          seo={{description: 'seoDescription'}}
        />
      );

      expect(wrapper).toContainReactComponent(TwitterSeo, {
        description: 'seoDescription',
      });
    });
  });

  describe('image prop', () => {
    it('renders <ImageSeo /> with image prop', () => {
      const image = {
        url: 'url-123',
        width: 1200,
        height: 600,
        altText: 'alt text',
      };
      const wrapper = mount(<CollectionSeo {...defaultProps} image={image} />);

      expect(wrapper).toContainReactComponent(ImageSeo, image);
    });
  });
});
