import * as React from 'react';
import {render, screen, renderHook} from '@testing-library/react';
import {
  ShopifyProvider,
  useShop,
  type ShopifyContextValue,
} from './ShopifyProvider.js';
import type {PartialDeep} from 'type-fest';

const SHOPIFY_CONFIG: ShopifyContextValue = {
  storeDomain: 'notashop.myshopify.com',
  storefrontToken: 'abc123',
  storefrontApiVersion: '2022-07',
  country: {
    isoCode: 'CA',
  },
  language: {
    isoCode: 'EN',
  },
  locale: 'en-CA',
};

describe('<ShopifyProvider/>', () => {
  it('renders its children', () => {
    render(
      <ShopifyProvider shopifyConfig={SHOPIFY_CONFIG}>
        <div>child</div>;
      </ShopifyProvider>
    );

    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it(`contains 'storeDomain' without https:// prefix`, () => {
    const {result} = renderHook(() => useShop(), {
      wrapper: ({children}) => (
        <ShopifyProvider
          shopifyConfig={{
            ...SHOPIFY_CONFIG,
            storeDomain: 'https://notashop.myshopify.com',
          }}
        >
          {children}
        </ShopifyProvider>
      ),
    });

    expect(result.current.storeDomain).toBe('notashop.myshopify.com');
  });
});

export function getShopifyConfig(
  config: PartialDeep<ShopifyContextValue> = {}
) {
  return {
    country: {
      isoCode: config.country?.isoCode ?? 'US',
    },
    language: {
      isoCode: config.language?.isoCode ?? 'EN',
    },
    locale: config.locale ?? 'EN-US',
    storeDomain: config.storeDomain ?? 'notashop.myshopify.io',
    storefrontToken: config.storefrontToken ?? 'abc123',
    storefrontApiVersion: config.storefrontApiVersion ?? '2022-07',
  };
}
