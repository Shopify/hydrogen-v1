import React from 'react';
import {mount} from '@shopify/react-testing';

import {Seo} from '../Seo.client';

import {DefaultPageSeo} from '../DefaultPageSeo.client';
import {HomePageSeo} from '../HomePageSeo.client';
import {ProductSeo} from '../ProductSeo.client';
import {CollectionSeo} from '../CollectionSeo.client';
import {PageSeo} from '../PageSeo.client';
import {TitleSeo} from '../TitleSeo.client';
import {DescriptionSeo} from '../DescriptionSeo.client';
import {TwitterSeo} from '../TwitterSeo.client';
import {ImageSeo} from '../ImageSeo.client';

jest.mock('../DefaultPageSeo.client', () => ({
  DefaultPageSeo() {
    return null;
  },
}));

jest.mock('../HomePageSeo.client', () => ({
  HomePageSeo() {
    return null;
  },
}));

jest.mock('../ProductSeo.client', () => ({
  ProductSeo() {
    return null;
  },
}));

jest.mock('../CollectionSeo.client', () => ({
  CollectionSeo() {
    return null;
  },
}));

jest.mock('../PageSeo.client', () => ({
  PageSeo() {
    return null;
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

jest.mock('../ImageSeo.client', () => ({
  ImageSeo() {
    return null;
  },
}));

describe('<Seo />', () => {
  describe('defaultPage prop', () => {
    it('renders <DefaultPageSeo /> if defaultPage prop exist', () => {
      const defaultPage = {
        title: 'test title',
        description: 'test description',
      };
      const wrapper = mount(<Seo defaultPage={defaultPage} />);

      expect(wrapper).toContainReactComponent(DefaultPageSeo, {...defaultPage});
    });

    it('deos not render <DefaultPageSeo /> if defaultPage prop does not exist', () => {
      const wrapper = mount(<Seo defaultPage={undefined} />);

      expect(wrapper).not.toContainReactComponent(DefaultPageSeo);
    });

    it('deos not throw warming if defaultPage prop exist with image prop', () => {
      console.warn = jest.fn();
      mount(
        <Seo
          defaultPage={{title: 'test title', description: 'test description'}}
          image={{url: 'https://test.com/test.png'}}
        />
      );

      expect(console.warn).not.toHaveBeenCalled();
    });

    it('throws warming if defaultPage prop exist any other prop', () => {
      console.warn = jest.fn();
      mount(
        <Seo
          defaultPage={{title: 'test title', description: 'test description'}}
          title="test title"
          description="test description"
        />
      );

      expect(console.warn).toHaveBeenCalledWith(
        'Using <Seo/> with props defaultPage, title and description will result in un-intentional override Seo values. Please check the documentation for the combination of props that is recommended.'
      );
    });
  });

  describe('homePage prop', () => {
    it('renders <HomePageSeo /> if homePage prop exist', () => {
      const homePage = {title: 'test title', url: 'https://test.com'};
      const wrapper = mount(<Seo homePage={homePage} />);

      expect(wrapper).toContainReactComponent(HomePageSeo, {...homePage});
    });

    it('deos not render <HomePageSeo /> if homePage prop does not exist', () => {
      const wrapper = mount(<Seo homePage={undefined} />);

      expect(wrapper).not.toContainReactComponent(HomePageSeo);
    });
  });

  describe('product prop', () => {
    it('renders <ProductSeo /> if product prop exist', () => {
      const product = {
        title: 'default title',
        description: 'default description',
        seo: {},
        handle: 'default handle',
        vendor: 'default vendor',
        images: {edges: []},
        variants: {
          edges: [],
        },
      };
      const wrapper = mount(<Seo product={product} />);

      expect(wrapper).toContainReactComponent(ProductSeo, {...product});
    });

    it('deos not render <ProductSeo /> if product prop does not exist', () => {
      const wrapper = mount(<Seo product={undefined} />);

      expect(wrapper).not.toContainReactComponent(ProductSeo);
    });
  });

  describe('collection prop', () => {
    it('renders <CollectionSeo /> if collection prop exist', () => {
      const collection = {
        title: 'default title',
        description: 'default description',
      };
      const wrapper = mount(<Seo collection={collection} />);

      expect(wrapper).toContainReactComponent(CollectionSeo, {...collection});
    });

    it('deos not render <CollectionSeo /> if collection prop does not exist', () => {
      const wrapper = mount(<Seo collection={undefined} />);

      expect(wrapper).not.toContainReactComponent(CollectionSeo);
    });
  });

  describe('page prop', () => {
    it('renders <PageSeo /> if page prop exist', () => {
      const page = {title: 'fallbackTitle', seo: {}};
      const wrapper = mount(<Seo page={page} />);

      expect(wrapper).toContainReactComponent(PageSeo, {...page});
    });

    it('deos not render <PageSeo /> if page prop does not exist', () => {
      const wrapper = mount(<Seo page={undefined} />);

      expect(wrapper).not.toContainReactComponent(PageSeo);
    });
  });

  describe('title prop', () => {
    it('renders <TitleSeo /> if title prop exist', () => {
      const title = 'fallbackTitle';
      const wrapper = mount(<Seo title={title} />);

      expect(wrapper).toContainReactComponent(TitleSeo, {title});
    });

    it('deos not render <TitleSeo /> if title prop does not exist', () => {
      const wrapper = mount(<Seo title={undefined} />);

      expect(wrapper).not.toContainReactComponent(TitleSeo);
    });
  });

  describe('description prop', () => {
    it('renders <DescriptionSeo /> if description prop exist', () => {
      const description = 'fallbackTitle';
      const wrapper = mount(<Seo description={description} />);

      expect(wrapper).toContainReactComponent(DescriptionSeo, {description});
    });

    it('deos not render <DescriptionSeo /> if description prop does not exist', () => {
      const wrapper = mount(<Seo description={undefined} />);

      expect(wrapper).not.toContainReactComponent(DescriptionSeo);
    });
  });

  describe('twitter prop', () => {
    it('renders <TwitterSeo /> if twitter prop exist', () => {
      const twitter = {title: 'fallbackTitle', seo: {}};
      const wrapper = mount(<Seo twitter={twitter} />);

      expect(wrapper).toContainReactComponent(TwitterSeo, {...twitter});
    });

    it('deos not render <TwitterSeo /> if twitter prop does not exist', () => {
      const wrapper = mount(<Seo twitter={undefined} />);

      expect(wrapper).not.toContainReactComponent(TwitterSeo);
    });
  });

  describe('image prop', () => {
    it('renders <ImageSeo /> if image prop exist', () => {
      const image = {
        url: 'https://test.com/test.png',
        width: 600,
        height: 1200,
      };
      const wrapper = mount(<Seo image={image} />);

      expect(wrapper).toContainReactComponent(ImageSeo, {...image});
    });

    it('deos not render <ImageSeo /> if image prop does not exist', () => {
      const wrapper = mount(<Seo image={undefined} />);

      expect(wrapper).not.toContainReactComponent(ImageSeo);
    });
  });
});
