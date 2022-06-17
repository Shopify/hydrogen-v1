import React from 'react';
import { Head } from '../../client';
import { TitleSeo } from './TitleSeo.client';
import { DescriptionSeo } from './DescriptionSeo.client';
export function HomePageSeo({ title, description, url }) {
    const organizationSchema = {
        '@context': 'http://schema.org',
        '@type': 'Organization',
        name: title,
        url,
    };
    const webSiteSchema = {
        '@context': 'http://schema.org',
        '@type': 'WebSite',
        name: title,
        url,
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Head, null,
            React.createElement("meta", { property: "og:url", content: url }),
            React.createElement("script", { type: "application/ld+json" }, JSON.stringify(organizationSchema)),
            React.createElement("script", { type: "application/ld+json" }, JSON.stringify(webSiteSchema))),
        React.createElement(TitleSeo, { title: title }),
        description && React.createElement(DescriptionSeo, { description: description })));
}
