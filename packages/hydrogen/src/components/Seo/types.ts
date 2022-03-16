import type {
  SeoFragmentFragment,
  DefaultPageSeoFragmentFragment,
  HomeSeoFragmentFragment,
} from './SeoFragment';
import type {Scalars} from '../../storefront-api-types';

export interface Twitter {
  site: string;
  title: SeoFragmentFragment['title'];
  description: SeoFragmentFragment['description'];
}

export interface HomePage extends HomeSeoFragmentFragment {
  url: Scalars['URL'];
}

export interface DefaultPage extends DefaultPageSeoFragmentFragment {
  url: Scalars['URL'];
  titleTemplate?: string;
  lang?: string;
}
