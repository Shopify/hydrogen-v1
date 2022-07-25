import React from 'react';

import {mount} from '@shopify/react-testing';

import {ProductSeo} from '../ProductSeo.client.js';
import {TitleSeo} from '../TitleSeo.client.js';
import {DescriptionSeo} from '../DescriptionSeo.client.js';
import {TwitterSeo} from '../TwitterSeo.client.js';
import {ImageSeo} from '../ImageSeo.client.js';
import {CurrencyCode} from '../../../storefront-api-types.js';

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

jest.mock('../ImageSeo.client', () => ({
  ImageSeo() {
    return null;
  },
}));

const defaultProps = {
  url: 'https://test.com/product/123',
  title: 'default title',
  description: 'default description',
  seo: {},
  handle: 'default handle',
  vendor: 'default vendor',
  featuredImage: {url: 'https://test-123/image.png', width: 1200, height: 600},
  variants: {
    edges: [],
  },
};

describe('<ProductSeo />', () => {
  it("renders <meta/> with property='og:type' by default", () => {
    const wrapper = mount(<ProductSeo {...defaultProps} />);

    expect(wrapper).toContainReactComponent('meta', {
      property: 'og:type',
      content: 'og:product',
    });
  });

  it('renders <meta /> with property="og:price:amount" with the first variant price', () => {
    const amount = 345.12;
    const variants = {
      edges: [
        {
          node: {
            image: {
              url: 'https://test-123/image.png',
            },
            availableForSale: false,
            priceV2: {
              amount: amount.toString(),
              currencyCode: 'CAD' as CurrencyCode,
            },
          },
        },
      ],
    };
    const wrapper = mount(<ProductSeo {...defaultProps} variants={variants} />);

    expect(wrapper).toContainReactComponent('meta', {
      property: 'og:price:amount',
      content: `${amount}`,
    });
  });

  it('renders <meta /> with property="og:price:currency" with the first variant price', () => {
    const currencyCode = 'CAD' as CurrencyCode;
    const variants = {
      edges: [
        {
          node: {
            image: {
              url: 'https://test-123/image.png',
            },
            availableForSale: false,
            priceV2: {amount: (123.45).toString(), currencyCode},
          },
        },
      ],
    };
    const wrapper = mount(<ProductSeo {...defaultProps} variants={variants} />);

    expect(wrapper).toContainReactComponent('meta', {
      property: 'og:price:currency',
      content: currencyCode,
    });
  });

  it('renders <ImageSeo /> with the first node of featuredImage prop', () => {
    const image = {
      url: 'url-123',
      width: 1200,
      height: 600,
      altText: 'alt text',
    };
    const wrapper = mount(
      <ProductSeo {...defaultProps} featuredImage={image} />
    );

    expect(wrapper).toContainReactComponent(ImageSeo, image);
  });

  describe('product schema', () => {
    it('renders <script/> with product schema as default', () => {
      const wrapper = mount(<ProductSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent('script', {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'http://schema.org/',
          '@type': 'Product',
          name: defaultProps.title,
          description: defaultProps.description,
          brand: {
            '@type': 'Thing',
            name: defaultProps.vendor,
          },
          url: 'https://test.com/product/123',
          image: 'https://test-123/image.png',
        }),
      });
    });

    it('renders <script/> with product schema and the first image in images', () => {
      const image = {
        url: 'url-123',
        width: 1200,
        height: 600,
      };

      const wrapper = mount(
        <ProductSeo {...defaultProps} featuredImage={image} />
      );

      expect(wrapper).toContainReactComponent('script', {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'http://schema.org/',
          '@type': 'Product',
          name: defaultProps.title,
          description: defaultProps.description,
          brand: {
            '@type': 'Thing',
            name: defaultProps.vendor,
          },
          url: 'https://test.com/product/123',
          image: image.url,
        }),
      });
    });

    it('renders <script/> with product schema and the first variant', () => {
      const variant = {
        image: {
          url: 'https://test-123/image.png',
        },
        availableForSale: false,
        priceV2: {
          amount: (123.45).toString(),
          currencyCode: 'CAD' as CurrencyCode,
        },
        sku: 'CK02112101',
      };

      const wrapper = mount(
        <ProductSeo
          {...defaultProps}
          variants={{
            edges: [
              {
                node: variant,
              },
            ],
          }}
        />
      );

      expect(wrapper).toContainReactComponent('script', {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'http://schema.org/',
          '@type': 'Product',
          name: defaultProps.title,
          description: defaultProps.description,
          brand: {
            '@type': 'Thing',
            name: defaultProps.vendor,
          },
          url: 'https://test.com/product/123',
          image: 'https://test-123/image.png',
          sku: variant.sku,
          offers: [
            {
              '@type': 'Offer',
              availability: 'https://schema.org/OutOfStock',
              price: variant.priceV2.amount,
              priceCurrency: variant.priceV2.currencyCode,
              sku: variant.sku,
              image: variant.image.url,
            },
          ],
        }),
      });
    });
  });

  describe('title prop', () => {
    it('renders <TitleSeo /> with title prop', () => {
      const wrapper = mount(<ProductSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent(TitleSeo, {
        title: defaultProps.title,
      });
    });

    it('renders <TwitterSeo /> with title prop', () => {
      const wrapper = mount(<ProductSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent(TwitterSeo, {
        title: defaultProps.title,
      });
    });
  });

  describe('description prop', () => {
    it('renders <DescriptionSeo /> with description prop', () => {
      const wrapper = mount(<ProductSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent(DescriptionSeo, {
        description: defaultProps.description,
      });
    });

    it('renders <TwitterSeo /> with description prop', () => {
      const wrapper = mount(<ProductSeo {...defaultProps} />);

      expect(wrapper).toContainReactComponent(TwitterSeo, {
        description: defaultProps.description,
      });
    });
  });

  describe('seo title prop', () => {
    it('renders <TitleSeo /> with seo title prop', () => {
      const wrapper = mount(
        <ProductSeo {...defaultProps} seo={{title: 'seoTitle'}} />
      );

      expect(wrapper).toContainReactComponent(TitleSeo, {
        title: 'seoTitle',
      });
    });

    it('renders <TwitterSeo /> with seo title prop', () => {
      const wrapper = mount(
        <ProductSeo {...defaultProps} seo={{title: 'seoTitle'}} />
      );

      expect(wrapper).toContainReactComponent(TwitterSeo, {
        title: 'seoTitle',
      });
    });
  });

  describe('seo description prop', () => {
    it('renders <DescriptionSeo /> with seo description prop', () => {
      const wrapper = mount(
        <ProductSeo {...defaultProps} seo={{description: 'seoDescription'}} />
      );

      expect(wrapper).toContainReactComponent(DescriptionSeo, {
        description: 'seoDescription',
      });
    });

    it('renders <TwitterSeo /> with seo description prop', () => {
      const wrapper = mount(
        <ProductSeo {...defaultProps} seo={{description: 'seoDescription'}} />
      );

      expect(wrapper).toContainReactComponent(TwitterSeo, {
        description: 'seoDescription',
      });
    });
  });
});
