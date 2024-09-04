import React from 'react';
import {Table} from './Table.js';

interface Props {
  session: any;
}

const KEY_MAP = {
  session: 'Session',
};

export function Storage(props: Props) {
  const items = Object.entries(props).map(([key, value]) => {
    return {
      id: KEY_MAP[key as keyof typeof KEY_MAP],
      value,
      type: typeof value,
    };
  });

  return <Table items={items} />;
}
