import {
  useLocalization,
  useShopQuery,
  CacheLong,
  gql,
  type HydrogenRouteProps,
} from '@shopify/hydrogen';
import type {Menu, Shop} from '@shopify/hydrogen/storefront-api-types';

import {Footer} from '~/components/index.server';
import {parseMenu} from '~/lib/utils';

const FOOTER_MENU_HANDLE = 'footer';

export default function FooterMenu({response}: HydrogenRouteProps) {
  response.cache(CacheLong());

  const {footerMenu} = useLayoutQuery();
  return <Footer menu={footerMenu} />;
}

function useLayoutQuery() {
  const {
    language: {isoCode: languageCode},
  } = useLocalization();

  const {data} = useShopQuery<{
    footerMenu: Menu;
  }>({
    query: SHOP_QUERY,
    variables: {
      language: languageCode,
      footerMenuHandle: FOOTER_MENU_HANDLE,
    },
    cache: CacheLong(),
    preload: '*',
  });

  /*
    Modify specific links/routes (optional)
    @see: https://shopify.dev/api/storefront/unstable/enums/MenuItemType
    e.g here we map:
      - /blogs/news -> /news
      - /blog/news/blog-post -> /news/blog-post
      - /collections/all -> /products
  */
  const customPrefixes = {BLOG: '', CATALOG: 'products'};

  const footerMenu = data?.footerMenu
    ? parseMenu(data.footerMenu, customPrefixes)
    : undefined;

  return {footerMenu};
}

const SHOP_QUERY = gql`
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  query layoutFooterMenus($language: LanguageCode, $footerMenuHandle: String!)
  @inContext(language: $language) {
    footerMenu: menu(handle: $footerMenuHandle) {
      id
      items {
        ...MenuItem
        items {
          ...MenuItem
        }
      }
    }
  }
`;
