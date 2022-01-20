import React from 'react';
// eslint-disable-next-line node/no-extraneous-import
import {mount} from '@shopify/react-testing';
import {ShopifyProvider} from '../ShopifyProvider';
import {ShopifyContext} from '../ShopifyContext';
import {DEFAULT_API_VERSION, DEFAULT_LOCALE} from '../../constants';
import {SHOPIFY_CONFIG} from './fixtures';

describe('<ShopifyProvider />', () => {
  it('renders its children', () => {
    const provider = mount(
      <ShopifyProvider shopifyConfig={SHOPIFY_CONFIG}>
        <Children />
      </ShopifyProvider>
    );

    expect(provider).toContainReactComponent(Children);
  });

  describe('renders ShopifyContext.Provider', () => {
    it('contains defaultLocale from shopifyConfig as locale', () => {
      const provider = mount(
        <ShopifyProvider
          shopifyConfig={{
            defaultLocale: 'zh-TW',
            storeDomain: 'hydrogen-preview.myshopify.com',
            storefrontToken: '1234',
          }}
        >
          <Children />
        </ShopifyProvider>
      );

      expect(provider).toContainReactComponent(ShopifyContext.Provider, {
        value: expect.objectContaining({locale: 'zh-TW'}),
      });
    });

    it('contains DEFAULT_LOCALE as local when locale is not specify in locale prop or shopifyConfig', () => {
      const provider = mount(
        <ShopifyProvider
          shopifyConfig={{
            storeDomain: 'hydrogen-preview.myshopify.com',
            storefrontToken: '1234',
          }}
        >
          <Children />
        </ShopifyProvider>
      );

      expect(provider).toContainReactComponent(ShopifyContext.Provider, {
        value: expect.objectContaining({locale: DEFAULT_LOCALE}),
      });
    });

    it('contains storeDomain without https prefix', () => {
      const provider = mount(
        <ShopifyProvider
          shopifyConfig={{
            storeDomain: 'https://hydrogen-preview.myshopify.com',
            storefrontToken: '1234',
          }}
        >
          <Children />
        </ShopifyProvider>
      );

      expect(provider).toContainReactComponent(ShopifyContext.Provider, {
        value: expect.objectContaining({
          storeDomain: 'hydrogen-preview.myshopify.com',
        }),
      });
    });

    it('contains graphqlApiVersion from shopifyConfig', () => {
      const provider = mount(
        <ShopifyProvider
          shopifyConfig={{
            storeDomain: 'hydrogen-preview.myshopify.com',
            storefrontToken: '1234',
            graphqlApiVersion: '2022-04',
          }}
        >
          <Children />
        </ShopifyProvider>
      );

      expect(provider).toContainReactComponent(ShopifyContext.Provider, {
        value: expect.objectContaining({
          graphqlApiVersion: '2022-04',
        }),
      });
    });

    it('contains DEFAULT_API_VERSION as graphqlApiVersion when it is not specify in shopifyConfig', () => {
      const provider = mount(
        <ShopifyProvider
          shopifyConfig={{
            storeDomain: 'hydrogen-preview.myshopify.com',
            storefrontToken: '1234',
          }}
        >
          <Children />
        </ShopifyProvider>
      );

      expect(provider).toContainReactComponent(ShopifyContext.Provider, {
        value: expect.objectContaining({
          graphqlApiVersion: DEFAULT_API_VERSION,
        }),
      });
    });
  });
});

function Children() {
  return null;
}
