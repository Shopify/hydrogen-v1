import {Suspense} from 'react';
import {
  useShop,
  useShopQuery,
  LocalizationProvider,
  CacheLong,
  gql,
} from '@shopify/hydrogen';

import {Header, Footer} from '~/components';
import {parseMenu} from '~/lib/utils';

const HEADER_MENU_HANDLE = 'main-menu';
const FOOTER_MENU_HANDLE = 'footer';

/**
 * A server component that defines a structure and organization of a page that can be used in different parts of the Hydrogen app
 */
export function Layout({children}) {
  const {languageCode} = useShop();

  const {data} = useShopQuery({
    query: SHOP_QUERY,
    variables: {
      language: languageCode,
      headerMenuHandle: HEADER_MENU_HANDLE,
      footerMenuHandle: FOOTER_MENU_HANDLE,
    },
    cache: CacheLong(),
    preload: '*',
  });

  const shopName = data ? data.shop.name : 'Hydrogen Demo Store';

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
    : null;

  const footerMenu = data?.footerMenu
    ? parseMenu(data.footerMenu, customPrefixes)
    : null;

  return (
    <LocalizationProvider preload="*">
      <div className="flex flex-col min-h-screen">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        {/* <div className="px-4 py-2 bg-primary text-contrast md:py-4 md:px-8 lg:px-16">
          <Text>Wrong Country Banner</Text>
        </div> */}
        <Suspense fallback={null}>
          <Header title={shopName} menu={headerMenu} />
        </Suspense>
        <main role="main" id="mainContent" className="flex-grow">
          <Suspense fallback={null}>{children}</Suspense>
        </main>
      </div>
      <Footer menu={footerMenu} />
    </LocalizationProvider>
  );
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
  query layout(
    $language: LanguageCode
    $headerMenuHandle: String!
    $footerMenuHandle: String!
  ) @inContext(language: $language) {
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
