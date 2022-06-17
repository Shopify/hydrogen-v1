import React from 'react';
import { CloseIcon, HydrogenIcon } from './icons';
export function Interface({ children, onClose, onOpen, ...props }) {
    const open = false || props.open;
    return (React.createElement("div", { id: "hydrogen-dev-tools", "aria-hidden": true, style: {
            position: 'fixed',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            right: 0,
            bottom: 0,
            padding: '1.5em',
            maxWidth: '100%',
            flexWrap: 'wrap',
        } },
        React.createElement("button", { type: "button", style: {
                position: 'relative',
                background: 'white',
                border: '1px solid',
                padding: '0em 0.5em 0.25em 1.25em',
                boxShadow: '10px 10px 0px black',
                display: 'flex',
                alignItems: 'center',
                color: 'black',
            }, onClick: onOpen },
            React.createElement("div", { style: { textAlign: 'left', flex: 1 } },
                React.createElement("span", { style: {
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        paddingRight: '0.5em',
                    } }, "Dev tools")),
            ' ',
            open ? React.createElement(CloseIcon, null) : React.createElement(HydrogenIcon, null)),
        React.createElement("div", { style: {
                display: open ? 'block' : 'none',
                position: 'relative',
                top: '-1px',
                overflow: 'scroll',
                color: 'black',
                background: 'white',
                border: '1px solid',
                boxShadow: '10px 10px 0px black',
                maxWidth: '50em',
                width: '100vw',
                height: '50vh',
            } }, children)));
}
