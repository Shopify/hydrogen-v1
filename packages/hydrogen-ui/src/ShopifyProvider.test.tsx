import * as React from 'react';
import {render, screen} from '@testing-library/react';
import {
  ShopifyProvider,
  useShop,
  type ShopifyContextValue,
} from './ShopifyProvider.js';

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
    function OutputDomain() {
      const {storeDomain} = useShop();
      return <div>{storeDomain}</div>;
    }
    render(
      <ShopifyProvider
        shopifyConfig={{
          ...SHOPIFY_CONFIG,
          storeDomain: 'https://notashop.myshopify.com',
        }}
      >
        <OutputDomain />
      </ShopifyProvider>
    );

    expect(
      screen.queryByText('https://notashop.myshopify.com')
    ).not.toBeInTheDocument();
    expect(screen.getByText('notashop.myshopify.com')).toBeInTheDocument();
  });
});
