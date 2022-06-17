import React from 'react';
import { useShop } from '../../foundation';
import { Head } from '../../client';
export function NoIndexPageSeo({ title, titleTemplate, lang, }) {
    const { languageCode: fallBacklang } = useShop();
    return (React.createElement(React.Fragment, null,
        React.createElement(Head, { defaultTitle: title ?? '', titleTemplate: titleTemplate ?? `%s - ${title}` },
            React.createElement("html", { lang: lang ?? fallBacklang }),
            React.createElement("meta", { name: "robots", content: "noindex" }))));
}
