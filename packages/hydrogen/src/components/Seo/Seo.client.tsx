import React, {type ComponentProps} from 'react';
import {useUrl} from '../../foundation/useUrl';
import {DefaultPageSeo} from './DefaultPageSeo.client';
import {HomePageSeo} from './HomePageSeo.client';
import {ProductSeo} from './ProductSeo.client';
import {CollectionSeo} from './CollectionSeo.client';
import {PageSeo} from './PageSeo.client';
import {NoIndexPageSeo} from './NoIndexSeo.client';
import type {
  DefaultPage as DefaultPageType,
  HomePage as HomePageType,
} from './seo-types';

type Props =
  | {
      type: 'defaultSeo';
      data: Omit<DefaultPageType, 'url'>;
    }
  | {
      type: 'homepage';
      data: Omit<HomePageType, 'url'>;
    }
  | {
      type: 'product';
      data: Omit<ComponentProps<typeof ProductSeo>, 'url'>;
    }
  | {
      type: 'collection';
      data: Omit<ComponentProps<typeof CollectionSeo>, 'url'>;
    }
  | {
      type: 'page';
      data: ComponentProps<typeof PageSeo>;
    }
  | {
      type: 'noindex';
      data: ComponentProps<typeof NoIndexPageSeo>;
    };

/**
 * The `Seo` component renders SEO information on a webpage.
 */
export function Seo(props: Props) {
  const url = useUrl().href;

  switch (props.type) {
    case 'defaultSeo':
      return <DefaultPageSeo {...{url, ...props.data}} />;
    case 'homepage':
      return <HomePageSeo {...{url, ...props.data}} />;
    case 'product':
      return <ProductSeo {...{url, ...props.data}} />;
    case 'collection':
      return <CollectionSeo {...{url, ...props.data}} />;
    case 'page':
      return <PageSeo {...props.data} />;
    case 'noindex':
      return <NoIndexPageSeo {...props.data} />;
    default:
      console.warn(
        'The <Seo/> only accepts type prop with values of defaultSeo, homepage, product, collection, or page.'
      );
      return null;
  }
}
