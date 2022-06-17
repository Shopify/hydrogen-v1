import React from 'react';
import { useShop } from '../../foundation';
import { Head } from '../../client';
import { TitleSeo } from './TitleSeo.client';
import { DescriptionSeo } from './DescriptionSeo.client';
import { TwitterSeo } from './TwitterSeo.client';
export function DefaultPageSeo({ title, description, url, titleTemplate, lang, }) {
    const { languageCode: fallBacklang } = useShop();
    return (React.createElement(React.Fragment, null,
        React.createElement(Head, { defaultTitle: title ?? '', titleTemplate: titleTemplate ?? `%s - ${title}` },
            React.createElement("html", { lang: lang ?? fallBacklang }),
            React.createElement("meta", { property: "og:type", content: "website" }),
            React.createElement("meta", { property: "og:site_name", content: title ?? '' }),
            React.createElement("meta", { property: "og:url", content: url })),
        React.createElement(TitleSeo, { title: title }),
        React.createElement(DescriptionSeo, { description: description }),
        React.createElement(TwitterSeo, { title: title, description: description })));
}
