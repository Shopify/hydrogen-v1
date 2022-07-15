import React from 'react';
import {Head} from '../../../foundation/Head/Head.client.js';
import {DefaultPageSeo} from '../DefaultPageSeo.client.js';
import {TitleSeo} from '../TitleSeo.client.js';
import {DescriptionSeo} from '../DescriptionSeo.client.js';
import {TwitterSeo} from '../TwitterSeo.client.js';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount.js';

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
  beforeAll(() => {
    // TODO: we may want to move this to our global jest setup if we find that
    // we need to ignore a number of errors across multiple test files.

    // When we mount the Head component in our wrapper it is rendered in a <div />.
    // Nesting an <html /> component inside a <div /> is invalid HTML and React complains
    // Since it’s only in test, we can safely ignore this error.
    const ERROR_TO_IGNORE = /Warning: validateDOMNesting(...)/;

    // Cache the original console error so we can pass errors through
    // by calling it with errors that don't match our regex check.
    const originalTestConsoleError = console.error.bind(console);

    jest.spyOn(console, 'error').mockImplementation((...args: any[]) => {
      const [firstArgument] = args;

      // If the first argument is an error, and it matches our regex.
      if (
        typeof firstArgument === 'string' &&
        ERROR_TO_IGNORE.test(firstArgument)
      ) {
        // Ignore the error by returning early.
        return;
      }

      // Continue to report all other errors
      originalTestConsoleError(...args);
    });
  });

  describe('default', () => {
    it("renders <meta /> with property='og:type'", () => {
      const wrapper = mountWithProviders(<DefaultPageSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent('meta', {
        property: 'og:type',
        content: 'website',
      });
    });

    it('renders <html /> with lang using parsed locale from shopify provider by default', () => {
      const wrapper = mountWithProviders(<DefaultPageSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent('html', {
        lang: 'EN',
      });
    });

    it('renders <meta /> with url prop', () => {
      const wrapper = mountWithProviders(<DefaultPageSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent('meta', {
        property: 'og:url',
        content: defaultProps.url,
      });
    });
  });

  describe('title prop', () => {
    it('renders <Head /> with defaultTitle using title prop', () => {
      const wrapper = mountWithProviders(<DefaultPageSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent(Head, {
        defaultTitle: defaultProps.title,
      });
    });

    it('renders <Head /> with titleTemplate using default value and title prop', () => {
      const wrapper = mountWithProviders(<DefaultPageSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent(Head, {
        titleTemplate: `%s - ${defaultProps.title}`,
      });
    });

    it("renders <meta /> with property='og:site_name' title prop", () => {
      const wrapper = mountWithProviders(<DefaultPageSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent('meta', {
        property: 'og:site_name',
        content: defaultProps.title,
      });
    });

    it('renders <TitleSeo /> with title prop', () => {
      const wrapper = mountWithProviders(<DefaultPageSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent(TitleSeo, {
        title: defaultProps.title,
      });
    });

    it('renders <TwitterSeo /> with title prop', () => {
      const wrapper = mountWithProviders(<DefaultPageSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent(TwitterSeo, {
        title: defaultProps.title,
      });
    });
  });

  describe('description prop', () => {
    it('renders <DescriptionSeo /> with description prop', () => {
      const wrapper = mountWithProviders(<DefaultPageSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent(DescriptionSeo, {
        description: defaultProps.description,
      });
    });

    it('renders <TwitterSeo /> with description prop', () => {
      const wrapper = mountWithProviders(<DefaultPageSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent(TwitterSeo, {
        description: defaultProps.description,
      });
    });
  });

  describe('url prop', () => {
    it("renders <meta /> with property='og:url' and url prop", () => {
      const url = 'https://test-new.com/';

      const wrapper = mountWithProviders(
        <DefaultPageSeo {...defaultProps} url={url} />
      );

      expect(wrapper).toContainReactComponent('meta', {
        property: 'og:url',
        content: url,
      });
    });
  });

  describe('titleTemplate prop', () => {
    it('renders <Head /> with titleTemplate using titleTemplate prop', () => {
      const titleTemplate = '%s - default_title';
      const wrapper = mountWithProviders(
        <DefaultPageSeo {...defaultProps} titleTemplate={titleTemplate} />
      );

      expect(wrapper).toContainReactComponent(Head, {
        titleTemplate,
      });
    });
  });

  describe('lang prop', () => {
    it('renders <html /> with lang using lang prop', () => {
      const wrapper = mountWithProviders(
        <DefaultPageSeo {...defaultProps} lang="zh" />
      );

      expect(wrapper).toContainReactComponent('html', {
        lang: 'zh',
      });
    });
  });
});
