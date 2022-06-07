import {
  useShop,
  useShopQuery,
  LocalizationProvider,
  CacheHours,
  gql,
} from '@shopify/hydrogen';

import {Suspense} from 'react';
import {Header, Footer} from '~/components/sections';
import {parseMenu} from '~/lib/utils';

const HEADER_MENU_HANDLE = 'header-hydrogen';
const FOOTER_MENU_HANDLE = 'footer-hydrogen';

/**
 * A server component that defines a structure and organization of a page that can be used in different parts of the Hydrogen app
 */
export default function Layout({children}) {
  const {languageCode} = useShop();

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      language: languageCode,
      headerMenuHandle: HEADER_MENU_HANDLE,
      footerMenuHandle: FOOTER_MENU_HANDLE,
    },
    cache: CacheHours(),
    preload: '*',
  });

  const shopName = data ? data.shop.name : 'Hydrogen Demo Store';
  const shopDomain = data ? data.shop.primaryDomain.url : null;

  const headerMenu = parseMenu(data ? data.headerMenu : null, shopDomain);
  const footerMenu = parseMenu(data ? data.footerMenu : null, shopDomain);

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
        <Footer menu={footerMenu} />
      </div>
    </LocalizationProvider>
  );
}

const QUERY = gql`
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
      primaryDomain {
        url
      }
    }

    headerMenu: menu(handle: $headerMenuHandle) {
      id
      handle
      itemsCount
      title
      items {
        ...MenuItem
      }
    }

    footerMenu: menu(handle: $footerMenuHandle) {
      id
      handle
      itemsCount
      title
      items {
        ...MenuItem
        items {
          ...MenuItem
        }
      }
    }
  }
`;
