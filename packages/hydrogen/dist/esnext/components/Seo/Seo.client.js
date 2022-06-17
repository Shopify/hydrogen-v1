import React from 'react';
import { useUrl } from '../../foundation';
import { DefaultPageSeo } from './DefaultPageSeo.client';
import { HomePageSeo } from './HomePageSeo.client';
import { ProductSeo } from './ProductSeo.client';
import { CollectionSeo } from './CollectionSeo.client';
import { PageSeo } from './PageSeo.client';
import { NoIndexPageSeo } from './NoIndexSeo.client';
/**
 * The `Seo` component renders SEO information on a webpage.
 */
export function Seo(props) {
    const url = useUrl().href;
    switch (props.type) {
        case 'defaultSeo':
            return React.createElement(DefaultPageSeo, { ...{ url, ...props.data } });
        case 'homepage':
            return React.createElement(HomePageSeo, { ...{ url, ...props.data } });
        case 'product':
            return React.createElement(ProductSeo, { ...{ url, ...props.data } });
        case 'collection':
            return React.createElement(CollectionSeo, { ...props.data });
        case 'page':
            return React.createElement(PageSeo, { ...props.data });
        case 'noindex':
            return React.createElement(NoIndexPageSeo, { ...props.data });
        default:
            console.warn('The <Seo/> only accepts type prop with values of defaultSeo, homepage, product, collection, or page.');
            return null;
    }
}
