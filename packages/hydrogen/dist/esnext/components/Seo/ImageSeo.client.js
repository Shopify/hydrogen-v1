import React from 'react';
import { Head } from '../../client';
export function ImageSeo({ url, width, height, altText }) {
    return (React.createElement(Head, null,
        url && React.createElement("meta", { property: "og:image", content: url }),
        url && React.createElement("meta", { property: "og:image:secure_url", content: url }),
        width && React.createElement("meta", { property: "og:image:width", content: `${width}` }),
        height && React.createElement("meta", { property: "og:image:height", content: `${height}` }),
        altText && React.createElement("meta", { property: "og:image:alt", content: altText })));
}
