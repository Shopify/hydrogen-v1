import React from 'react';
export function Table({ items }) {
    const itemsMarkup = items.map(({ key, value }) => (React.createElement("div", { key: key, style: { display: 'flex' } },
        React.createElement("span", { style: { width: '30%', fontFamily: 'monospace', paddingRight: '1em' } }, key),
        React.createElement("span", { style: { width: '70%', fontFamily: 'monospace', fontWeight: 'bold' } }, value))));
    return React.createElement("ul", null, itemsMarkup);
}
