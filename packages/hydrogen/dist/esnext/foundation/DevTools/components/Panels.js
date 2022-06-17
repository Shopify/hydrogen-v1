import React, { useState, useEffect } from 'react';
import { ClientAnalytics } from '../../Analytics';
import { Performance } from './Performance.client';
import { Settings } from './Settings.client';
export function Panels({ settings }) {
    const [selectedPanel, setSelectedPanel] = useState(0);
    const [navigations, setNavigations] = useState([]);
    useEffect(() => {
        ClientAnalytics.subscribe(ClientAnalytics.eventNames.PERFORMANCE, ({ response_start, navigation_start, first_contentful_paint, largest_contentful_paint, response_end, page_load_type, url, transfer_size, }) => {
            setNavigations([
                ...navigations,
                {
                    ttfb: response_start - navigation_start,
                    fcp: first_contentful_paint,
                    lcp: largest_contentful_paint,
                    duration: response_end - navigation_start,
                    type: `${page_load_type} load`,
                    size: transfer_size,
                    url,
                },
            ]);
        });
    }, [setNavigations, navigations]);
    const panels = getPanels({ settings, performance: { navigations } });
    const panelComponents = panels.map((obj, index) => (React.createElement("div", { key: obj.content, style: { display: selectedPanel === index ? 'block' : 'none' } }, obj.panel)));
    return (React.createElement("div", { style: { display: 'flex', height: '100%' } },
        React.createElement("div", { style: { borderRight: '1px solid', padding: '1em 0em' } }, panels.map(({ content, icon, id }, index) => {
            const active = selectedPanel === index;
            return (React.createElement("button", { key: id, type: "button", style: {
                    lineHeight: 2,
                    padding: '0em 1.25em',
                    fontWeight: active ? 'bold' : 'normal',
                    display: 'flex',
                    alignItems: 'center',
                }, onClick: () => setSelectedPanel(index) },
                React.createElement("span", { style: { paddingRight: '0.4em' } }, icon),
                React.createElement("span", { style: { fontFamily: 'monospace' } }, content)));
        })),
        React.createElement("div", { style: { padding: '1.25em', width: '100%' } }, panelComponents[selectedPanel ? selectedPanel : 0])));
}
function Panel({ children }) {
    return React.createElement("div", null, children);
}
function getPanels({ settings, performance }) {
    const panels = {
        settings: {
            content: 'Settings',
            panel: React.createElement(Settings, { ...settings }),
            icon: '🎛',
        },
        performance: {
            content: 'Performance',
            panel: React.createElement(Performance, { ...performance }),
            icon: '⏱',
        },
    };
    return Object.keys(panels).map((key) => {
        return { ...panels[key], id: key };
    });
}
