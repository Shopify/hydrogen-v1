import React from 'react';
export function Heading({ linkText, url, children, }) {
    return (React.createElement("span", { style: { display: 'flex', alignItems: 'baseline', padding: '0 0 0.5em' } },
        React.createElement("span", { style: { paddingRight: '0em', flex: 1, fontWeight: 'bold' } },
            children,
            ' '),
        React.createElement("a", { style: {
                color: 'blue',
                fontFamily: 'monospace',
                textDecoration: 'underline',
            }, href: url }, linkText)));
}
