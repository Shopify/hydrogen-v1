import {
  useLocalization,
  useShopQuery,
  CacheLong,
  gql,
  type HydrogenRouteProps,
} from '@shopify/hydrogen';
import type {Menu, Shop} from '@shopify/hydrogen/storefront-api-types';

import {Header as HeaderClient} from '~/components';
import {parseMenu} from '~/lib/utils';

const HEADER_MENU_HANDLE = 'main-menu';
const SHOP_NAME_FALLBACK = 'Hydrogen';

export const Header = () => {
  const {shopName, headerMenu} = useLayoutQuery();
  return <HeaderClient title={shopName} menu={headerMenu} />;
};

function useLayoutQuery() {
  const {
    language: {isoCode: languageCode},
  } = useLocalization();

  const {data} = useShopQuery<{
    shop: Shop;
    headerMenu: Menu;
  }>({
    query: SHOP_QUERY,
    variables: {
      language: languageCode,
      headerMenuHandle: HEADER_MENU_HANDLE,
    },
    cache: CacheLong(),
    preload: '*',
  });

  const shopName = data ? data.shop.name : SHOP_NAME_FALLBACK;

  /*
    Modify specific links/routes (optional)
    @see: https://shopify.dev/api/storefront/unstable/enums/MenuItemType
    e.g here we map:
      - /blogs/news -> /news
      - /blog/news/blog-post -> /news/blog-post
      - /collections/all -> /products
  */
  const customPrefixes = {BLOG: '', CATALOG: 'products'};

  const headerMenu = data?.headerMenu
    ? parseMenu(data.headerMenu, customPrefixes)
    : undefined;

  return {headerMenu, shopName};
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
  query layoutHeaderMenus($language: LanguageCode, $headerMenuHandle: String!)
  @inContext(language: $language) {
    shop {
      name
    }
    headerMenu: menu(handle: $headerMenuHandle) {
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
