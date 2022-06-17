import React from 'react';
import { TitleSeo } from './TitleSeo.client';
import { DescriptionSeo } from './DescriptionSeo.client';
import { TwitterSeo } from './TwitterSeo.client';
import { ImageSeo } from './ImageSeo.client';
export function CollectionSeo({ title, description, seo, image, }) {
    const seoTitle = seo?.title ?? title;
    const seoDescription = seo?.description ?? description;
    return (React.createElement(React.Fragment, null,
        React.createElement(TitleSeo, { title: seoTitle }),
        React.createElement(DescriptionSeo, { description: seoDescription }),
        React.createElement(TwitterSeo, { title: seoTitle, description: seoDescription }),
        image && React.createElement(ImageSeo, { ...image })));
}
