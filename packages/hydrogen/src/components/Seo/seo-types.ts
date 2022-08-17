import type {
  Scalars,
  Shop as ShopType,
  Seo as SeoType,
} from '../../storefront-api-types.js';

export interface Twitter {
  site: string;
  title: SeoType['title'];
  description: SeoType['description'];
}

export interface HomePage {
  description: ShopType['description'];
  title: ShopType['name'];
  url: Scalars['URL'];
  titleTemplate?: string;
}

export interface DefaultPage extends ShopType {
  title: ShopType['name'];
  url: Scalars['URL'];
  titleTemplate?: string;
  lang?: string;
}
