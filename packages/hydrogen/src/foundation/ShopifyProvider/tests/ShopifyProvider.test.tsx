import React from 'react';
// eslint-disable-next-line node/no-extraneous-import
import {mount} from '@shopify/react-testing';
import {ShopifyProvider} from '../ShopifyProvider';
import {DEFAULT_API_VERSION} from '../../constants';

const CONFIG = {
  locale: 'en-us',
  storeDomain: 'hydrogen-preview.myshopify.com',
  storefrontToken: '1234',
  graphqlApiVersion: DEFAULT_API_VERSION,
};

describe('<ShopifyProvider />', () => {
  it('renders its children', () => {
    const provider = mount(
      <ShopifyProvider shopifyConfig={CONFIG}>
        <Children />
      </ShopifyProvider>
    );

    expect(provider).toContainReactComponent(Children);
  });
});

function Children() {
  return null;
}
