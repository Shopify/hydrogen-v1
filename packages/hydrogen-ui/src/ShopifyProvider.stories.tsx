import * as React from 'react';
import type {Story} from '@ladle/react';
import {
  ShopifyProvider,
  useShop,
  type ShopifyContextValue,
} from './ShopifyProvider.js';

const Template: Story<{
  storeDomain: string;
  storefrontToken: string;
  version: string;
}> = ({storeDomain, storefrontToken, version}) => {
  const config: ShopifyContextValue = {
    storeDomain,
    storefrontToken,
    storefrontApiVersion: version,
    country: {
      isoCode: 'CA',
    },
    language: {
      isoCode: 'EN',
    },
    locale: 'en-CA',
  };
  return (
    <ShopifyProvider shopifyConfig={config}>
      <TemplateChildren />
    </ShopifyProvider>
  );
};

const TemplateChildren = () => {
  const shopValues = useShop();
  return (
    <>
      Use the Controls tab change these values on the fly
      {Object.keys(shopValues).map((key) => {
        return (
          <p key={key}>
            <strong>{key}: </strong>
            {typeof shopValues[key] === 'string'
              ? shopValues[key]
              : JSON.stringify(shopValues[key])}
          </p>
        );
      })}
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  storeDomain: 'notashop.myshopify.com',
  storefrontToken: 'abc123',
  version: '2022-07',
};
