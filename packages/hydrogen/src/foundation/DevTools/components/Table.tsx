import React from 'react';

interface Item {
  id: string;
  value: string;
}

interface TableProps {
  items: Item[];
}

export function Table({items}: TableProps) {
  const itemsMarkup = items.map((item) => <Item key={item.id} {...item} />);
  return <ul>{itemsMarkup}</ul>;
}

export function Item(props: Item) {
  const {id, value} = props;

  const valueMarkup =
    typeof value === 'string' ? (
      <span style={{width: '70%', fontFamily: 'monospace'}}>{value}</span>
    ) : (
      Object.entries(value).map(([k, v]) => (
        <span key={k} style={{width: '70%', fontFamily: 'monospace'}}>
          <>
            <b>{k}</b>: {v}
          </>
        </span>
      ))
    );
  return (
    <div
      style={{display: 'flex', paddingBottom: '1em', flexDirection: 'column'}}
    >
      <span style={{fontWeight: 'bold'}}>{id}</span>
      {valueMarkup}
    </div>
  );
}
