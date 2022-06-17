import React from 'react';
import { Heading } from './Heading';
import { Table } from './Table';
const KEY_MAP = {
    locale: 'Locale',
    storeDomain: 'Domain',
    storefrontApiVersion: 'API Version',
};
export function Settings(props) {
    const items = Object.entries(props).map(([key, value]) => {
        return {
            key: KEY_MAP[key],
            value,
            type: typeof value,
        };
    });
    return (React.createElement(React.Fragment, null,
        React.createElement(Heading, null, "Config"),
        React.createElement(Table, { items: items })));
}
