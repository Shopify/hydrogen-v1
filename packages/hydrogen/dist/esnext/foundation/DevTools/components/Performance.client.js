import React from 'react';
import { Heading } from './Heading';
export function Performance({ navigations }) {
    const navigationsMarkup = navigations.map(({ url, ttfb, fcp, size, duration, type }) => (React.createElement("li", { key: url, style: { padding: '0.5em 0', borderBottom: '1px solid' } },
        React.createElement(Item, { label: type, value: url.replace('http://localhost:3000', '') }),
        React.createElement("div", { style: { display: 'flex' } },
            React.createElement(Item, { label: "TTFB", value: ttfb }),
            React.createElement(Item, { label: "Duration", value: duration }),
            React.createElement(Item, { label: "FCP", value: fcp })))));
    return (React.createElement(React.Fragment, null,
        React.createElement(Heading, null, "Performance"),
        React.createElement("ul", null, navigationsMarkup)));
}
const Item = ({ label, value, unit }) => {
    if (!value) {
        return null;
    }
    const val = typeof value === 'string' ? (React.createElement("span", { style: { fontWeight: 'bold' } }, value)) : (`${Math.round(value)}${unit || 'ms'}`);
    return (React.createElement("span", { style: {
            fontFamily: 'monospace',
            padding: '0 2em 0 0',
            fontSize: '0.75em',
        } },
        label && label.padEnd(10),
        val));
};
