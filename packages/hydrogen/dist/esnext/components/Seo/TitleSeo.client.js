import React from 'react';
import { Head } from '../../client';
export function TitleSeo({ title }) {
    if (!title) {
        return null;
    }
    return (React.createElement(Head, null,
        React.createElement("title", null, title),
        React.createElement("meta", { property: "og:title", content: title })));
}
