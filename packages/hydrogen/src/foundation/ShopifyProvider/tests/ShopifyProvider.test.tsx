import React from 'react';
import {mount} from '@shopify/react-testing';
import {ShopifyContext} from '../ShopifyProvider.client.js';
import {ShopifyProvider} from '../ShopifyProvider.server.js';
import {SHOPIFY_CONFIG} from './fixtures.js';
import {DEFAULT_COUNTRY, DEFAULT_LANGUAGE} from '../../constants.js';

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
            defaultLanguageCode: 'zh',
            defaultCountryCode: 'tw',
            storeDomain: 'hydrogen-preview.myshopify.com',
            storefrontToken: '1234',
            storefrontApiVersion: 'unstable',
          }}
        >
          <Children />
        </ShopifyProvider>
      );

      expect(provider).toContainReactComponent(ShopifyContext.Provider, {
        value: expect.objectContaining({
          defaultCountryCode: 'TW',
          defaultLanguageCode: 'ZH',
        }),
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
        value: expect.objectContaining({
          defaultLanguageCode: DEFAULT_LANGUAGE.toUpperCase(),
          defaultCountryCode: DEFAULT_COUNTRY.toUpperCase(),
        }),
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
            storefrontApiVersion: '2022-07',
          }}
        >
          <Children />
        </ShopifyProvider>
      );

      expect(provider).toContainReactComponent(ShopifyContext.Provider, {
        value: expect.objectContaining({
          storefrontApiVersion: '2022-07',
        }),
      });
    });
  });
});

function Children() {
  return null;
}
