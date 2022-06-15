import React from 'react';
import {Heading} from './Heading';
import {Table} from './Table';

interface Props {
  locale: string;
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

  return (
    <>
      <Heading>Config</Heading>
      <Table items={items} />
    </>
  );
}
