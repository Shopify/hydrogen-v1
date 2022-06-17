import { type ComponentProps } from 'react';
import { ProductSeo } from './ProductSeo.client';
import { CollectionSeo } from './CollectionSeo.client';
import { PageSeo } from './PageSeo.client';
import { NoIndexPageSeo } from './NoIndexSeo.client';
import type { DefaultPage as DefaultPageType, HomePage as HomePageType } from './seo-types';
declare type Props = {
    type: 'defaultSeo';
    data: Omit<DefaultPageType, 'url'>;
} | {
    type: 'homepage';
    data: Omit<HomePageType, 'url'>;
} | {
    type: 'product';
    data: Omit<ComponentProps<typeof ProductSeo>, 'url'>;
} | {
    type: 'collection';
    data: ComponentProps<typeof CollectionSeo>;
} | {
    type: 'page';
    data: ComponentProps<typeof PageSeo>;
} | {
    type: 'noindex';
    data: ComponentProps<typeof NoIndexPageSeo>;
};
/**
 * The `Seo` component renders SEO information on a webpage.
 */
export declare function Seo(props: Props): JSX.Element | null;
export {};
