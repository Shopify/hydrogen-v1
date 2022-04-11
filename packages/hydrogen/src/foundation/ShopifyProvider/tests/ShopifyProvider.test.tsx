import React from 'react';
import {mount} from '@shopify/react-testing';
import {ShopifyContext} from '../ShopifyProvider.client';
import {ShopifyProvider} from '../ShopifyProvider.server';
import {DEFAULT_LOCALE} from '../../constants';
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
            defaultLocale: 'zh-tw',
            storeDomain: 'hydrogen-preview.myshopify.com',
            storefrontToken: '1234',
            storefrontApiVersion: 'unstable',
          }}
        >
          <Children />
        </ShopifyProvider>
      );

      expect(provider).toContainReactComponent(ShopifyContext.Provider, {
        value: expect.objectContaining({locale: 'ZH-TW'}),
      });
    });

    it('contains DEFAULT_LOCALE as local when locale is not specify in locale prop or shopifyConfig', () => {
      const provider = mount(
        <ShopifyProvider
          shopifyConfig={{
            storeDomain: 'hydrogen-preview.myshopify.com',
            storefrontToken: '1234',
            storefrontApiVersion: 'unstable',
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
            storefrontApiVersion: 'unstable',
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

    it('contains storefrontApiVersion from shopifyConfig', () => {
      const provider = mount(
        <ShopifyProvider
          shopifyConfig={{
            storeDomain: 'hydrogen-preview.myshopify.com',
            storefrontToken: '1234',
            storefrontApiVersion: '2022-04',
          }}
        >
          <Children />
        </ShopifyProvider>
      );

      expect(provider).toContainReactComponent(ShopifyContext.Provider, {
        value: expect.objectContaining({
          storefrontApiVersion: '2022-04',
        }),
      });
    });
  });
});

function Children() {
  return null;
}
