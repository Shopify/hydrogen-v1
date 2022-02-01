import React from 'react';
import {mount} from '@shopify/react-testing';

import {Seo} from '../Seo.client';

import {DefaultPageSeo} from '../DefaultPageSeo.client';
import {HomePageSeo} from '../HomePageSeo.client';
import {ProductSeo} from '../ProductSeo.client';
import {CollectionSeo} from '../CollectionSeo.client';
import {PageSeo} from '../PageSeo.client';

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
  it('renders <DefaultPageSeo /> if type is defaultSeo', () => {
    const defaultPage = {
      url: 'https://store-name.com',
      title: 'test title',
      description: 'test description',
    };
    const wrapper = mount(<Seo type="defaultSeo" data={defaultPage} />);

    expect(wrapper).toContainReactComponent(DefaultPageSeo, {...defaultPage});
  });

  it('renders <HomePageSeo /> type is homepage', () => {
    const homePage = {title: 'test title', url: 'https://test.com'};
    const wrapper = mount(<Seo type="homepage" data={homePage} />);

    expect(wrapper).toContainReactComponent(HomePageSeo, {...homePage});
  });

  it('renders <ProductSeo /> if type is product', () => {
    const product = {
      url: 'https://store-name.com',
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
    const wrapper = mount(<Seo type="product" data={product} />);

    expect(wrapper).toContainReactComponent(ProductSeo, {...product});
  });

  it('renders <CollectionSeo /> if type is collection', () => {
    const collection = {
      title: 'default title',
      description: 'default description',
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
