import React from 'react';
import {Locale} from '../../ShopifyProvider/types.js';
import {Table} from './Table.js';

interface Props {
  locale: Locale;
  storeDomain: string;
  storefrontApiVersion: string;
}

const KEY_MAP = {
  locale: 'Locale',
  storeDomain: 'Domain',
  storefrontApiVersion: 'API Version',
};

export function Settings(props: Props) {
  const items = Object.entries(props).map(([key, value]) => {
    return {
      key: KEY_MAP[key as keyof typeof KEY_MAP],
      value,
      type: typeof value,
    };
  });

  return <Table items={items} />;
}
