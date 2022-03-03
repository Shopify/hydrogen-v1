import type {SeoFragment} from './SeoFragment';
import type {Scalars} from '../../graphql/types/types';

export type Title = SeoFragment['title'];
export type Description = SeoFragment['description'];

export interface Twitter {
  site: string;
  title: Title;
  description: Description;
}

export interface HomePage {
  title: Title;
  description: Description;
  url: Scalars['URL'];
}

export interface DefaultPage extends HomePage {
  titleTemplate?: string;
  lang?: string;
}
