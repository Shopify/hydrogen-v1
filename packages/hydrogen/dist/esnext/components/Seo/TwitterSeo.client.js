import React from 'react';
import { Head } from '../../client';
export function TwitterSeo({ site, title, description }) {
    return (React.createElement(Head, null,
        React.createElement("meta", { name: "twitter:card", content: "summary_large_image" }),
        site && React.createElement("meta", { name: "twitter:site", content: site }),
        title && React.createElement("meta", { name: "twitter:title", content: title }),
        description && React.createElement("meta", { name: "twitter:description", content: description })));
}
