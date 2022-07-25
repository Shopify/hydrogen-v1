import React from 'react';
import {mount} from '@shopify/react-testing';

import {Seo} from '../Seo.client.js';

import {DefaultPageSeo} from '../DefaultPageSeo.client.js';
import {HomePageSeo} from '../HomePageSeo.client.js';
import {ProductSeo} from '../ProductSeo.client.js';
import {CollectionSeo} from '../CollectionSeo.client.js';
import {PageSeo} from '../PageSeo.client.js';

const mockUrl = 'https://store-name.com/';

jest.mock('../../../foundation/useUrl/useUrl', () => ({
  useUrl: () => new URL(mockUrl),
}));

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

describe('<Seo />', () => {
  it('renders nothing and dispaly a warming if the type is not valid', () => {
    console.warn = jest.fn();
    // @ts-ignore
    const wrapper = mount(<Seo type="something" />);

    expect(wrapper.children.length).toBe(0);

    expect(console.warn).toHaveBeenCalledWith(
      'The <Seo/> only accepts type prop with values of defaultSeo, homepage, product, collection, or page.'
    );
  });

  it('renders <DefaultPageSeo /> if type is defaultSeo', () => {
    const defaultPage = {
      title: 'test title',
      description: 'test description',
    };
    // @ts-ignore
    const wrapper = mount(<Seo type="defaultSeo" data={defaultPage} />);

    expect(wrapper).toContainReactComponent(DefaultPageSeo, {
      ...defaultPage,
      url: mockUrl,
    });
  });

  it('renders <HomePageSeo /> type is homepage', () => {
    const homePage = {title: 'test title'};
    // @ts-ignore
    const wrapper = mount(<Seo type="homepage" data={homePage} />);

    expect(wrapper).toContainReactComponent(HomePageSeo, {
      ...homePage,
      url: mockUrl,
    });
  });

  it('renders <ProductSeo /> if type is product', () => {
    const product = {
      title: 'default title',
      description: 'default description',
      seo: {},
      handle: 'default handle',
      vendor: 'default vendor',
      featuredImage: {
        url: 'https://test-123/image.png',
        width: 1200,
        height: 600,
      },
      variants: {
        edges: [],
      },
    };
    const wrapper = mount(<Seo type="product" data={product} />);

    expect(wrapper).toContainReactComponent(ProductSeo, {
      ...product,
      url: mockUrl,
    });
  });

  it('renders <CollectionSeo /> if type is collection', () => {
    const collection = {
      title: 'default title',
      description: 'default description',
      seo: {},
    };
    const wrapper = mount(<Seo type="collection" data={collection} />);

    expect(wrapper).toContainReactComponent(CollectionSeo, {...collection});
  });

  it('renders <PageSeo /> if page prop exist', () => {
    const page = {title: 'fallbackTitle', seo: {}};
    const wrapper = mount(<Seo type="page" data={page} />);

    expect(wrapper).toContainReactComponent(PageSeo, {...page});
  });
});
