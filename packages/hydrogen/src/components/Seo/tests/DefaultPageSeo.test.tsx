import React from 'react';
import {mount} from '@shopify/react-testing';
import {Helmet} from 'react-helmet-async';

import {DefaultPageSeo} from '../DefaultPageSeo.client';
import {TitleSeo} from '../TitleSeo.client';
import {DescriptionSeo} from '../DescriptionSeo.client';
import {TwitterSeo} from '../TwitterSeo.client';

jest.mock('react-helmet-async', () => ({
  Helmet({children}) {
    return children;
  },
}));

jest.mock('../../../foundation', () => ({
  useShop() {
    return {locale: 'fr-CA'};
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

jest.mock('../TwitterSeo.client', () => ({
  TwitterSeo() {
    return null;
  },
}));

const defaultProps = {
  title: 'default title',
  description: 'default description',
  url: 'https://store-name.com',
};

describe('<DefaultPageSeo />', () => {
  describe('default', () => {
    it("renders <meta /> with property='og:type'", () => {
      const wrapper = mount(<DefaultPageSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent('meta', {
        property: 'og:type',
        content: 'website',
      });
    });

    it('renders <html /> with lang using parsed locale from shopify provider by default', () => {
      const wrapper = mount(<DefaultPageSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent('html', {
        lang: 'fr',
      });
    });

    it('renders <meta /> with url prop', () => {
      const wrapper = mount(<DefaultPageSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent('meta', {
        property: 'og:url',
        content: defaultProps.url,
      });
    });
  });

  describe('title prop', () => {
    it('renders <Helmet /> with defaultTitle using title prop', () => {
      const wrapper = mount(<DefaultPageSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent(Helmet, {
        defaultTitle: defaultProps.title,
      });
    });

    it('renders <Helmet /> with titleTemplate using default value and title prop', () => {
      const wrapper = mount(<DefaultPageSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent(Helmet, {
        titleTemplate: `%s - ${defaultProps.title}`,
      });
    });

    it("renders <meta /> with property='og:site_name' title prop", () => {
      const wrapper = mount(<DefaultPageSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent('meta', {
        property: 'og:site_name',
        content: defaultProps.title,
      });
    });

    it('renders <TitleSeo /> with title prop', () => {
      const wrapper = mount(<DefaultPageSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent(TitleSeo, {
        title: defaultProps.title,
      });
    });

    it('renders <TwitterSeo /> with title prop', () => {
      const wrapper = mount(<DefaultPageSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent(TwitterSeo, {
        title: defaultProps.title,
      });
    });
  });

  describe('description prop', () => {
    it('renders <DescriptionSeo /> with description prop', () => {
      const wrapper = mount(<DefaultPageSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent(DescriptionSeo, {
        description: defaultProps.description,
      });
    });

    it('renders <TwitterSeo /> with description prop', () => {
      const wrapper = mount(<DefaultPageSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent(TwitterSeo, {
        description: defaultProps.description,
      });
    });
  });

  describe('url prop', () => {
    it("renders <meta /> with property='og:url' and url prop", () => {
      const url = 'https://test-new.com/';

      const wrapper = mount(<DefaultPageSeo {...defaultProps} url={url} />);

      expect(wrapper).toContainReactComponent('meta', {
        property: 'og:url',
        content: url,
      });
    });
  });

  describe('titleTemplate prop', () => {
    it('renders <Helmet /> with titleTemplate using titleTemplate prop', () => {
      const titleTemplate = '%s - default_title';
      const wrapper = mount(
        <DefaultPageSeo {...defaultProps} titleTemplate={titleTemplate} />
      );

      expect(wrapper).toContainReactComponent(Helmet, {
        titleTemplate: titleTemplate,
      });
    });
  });

  describe('lang prop', () => {
    it('renders <html /> with lang using lang prop', () => {
      const wrapper = mount(<DefaultPageSeo {...defaultProps} lang="zh" />);

      expect(wrapper).toContainReactComponent('html', {
        lang: 'zh',
      });
    });
  });
});
