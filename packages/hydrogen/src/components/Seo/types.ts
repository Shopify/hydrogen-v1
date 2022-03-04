import type {SeoFragment} from './SeoFragment';
import type {Scalars} from '../../graphql/types/types';

export type Title = SeoFragment['title'];
export type Description = SeoFragment['description'];

export interface Twitter {
  site: string;
  title: Title;
  description: Description;
}

interface PageBase {
  title: Title;
  url: Scalars['URL'];
}

export interface HomePage extends PageBase {
  description?: Description;
}

export interface DefaultPage extends HomePage {
  description: Description;
  titleTemplate?: string;
  lang?: string;
}
