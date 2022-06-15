import React from 'react';

interface Item {
  key: string;
  value: string;
}

interface TableProps {
  items: Item[];
}

export function Table({items}: TableProps) {
  const itemsMarkup = items.map(({key, value}) => (
    <div key={key} style={{display: 'flex'}}>
      <span
        style={{width: '30%', fontFamily: 'monospace', paddingRight: '1em'}}
      >
        {key}
      </span>
      <span style={{width: '70%', fontFamily: 'monospace', fontWeight: 'bold'}}>
        {value}
      </span>
    </div>
  ));
  return <ul>{itemsMarkup}</ul>;
}
