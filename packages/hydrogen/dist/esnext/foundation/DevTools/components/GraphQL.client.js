import React, { useEffect, useState } from 'react';
export function GraphQL() {
    const [warnings, setWarnings] = useState(null);
    useEffect(() => {
        if (import.meta.hot) {
            import.meta.hot.on('hydrogen-dev-tools', ({ type, data }) => {
                if (type === 'warn') {
                    setWarnings((state) => [...(state || []), data]);
                }
            });
        }
    }, []);
    const warningsMarkup = warnings
        ? warnings.map((war, i) => (
        // eslint-disable-next-line react/no-array-index-key
        React.createElement("li", { key: war + i },
            React.createElement("pre", null, war))))
        : null;
    return (React.createElement("div", null,
        React.createElement("ul", { style: {
                fontFamily: 'monospace',
                paddingTop: '1em',
                fontSize: '0.9em',
            } }, warningsMarkup)));
}
