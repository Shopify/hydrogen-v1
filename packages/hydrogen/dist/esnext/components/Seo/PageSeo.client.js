import React from 'react';
import { TitleSeo } from './TitleSeo.client';
import { DescriptionSeo } from './DescriptionSeo.client';
import { TwitterSeo } from './TwitterSeo.client';
export function PageSeo({ title, seo }) {
    const seoTitle = seo?.title ?? title;
    const seoDescription = seo?.description;
    return (React.createElement(React.Fragment, null,
        React.createElement(TitleSeo, { title: seoTitle }),
        React.createElement(DescriptionSeo, { description: seoDescription }),
        React.createElement(TwitterSeo, { title: seoTitle, description: seoDescription })));
}
