import {
  useShop,
  useShopQuery,
  LocalizationProvider,
  CacheHours,
  gql,
} from '@shopify/hydrogen';

import {Suspense} from 'react';
import {Header, Footer} from '~/components/sections';

/**
 * A server component that defines a structure and organization of a page that can be used in different parts of the Hydrogen app
 */
export default function Layout({children}) {
  const {languageCode} = useShop();

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      language: languageCode,
    },
    cache: CacheHours(),
    preload: '*',
  });

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
          <Header title={data ? data.shop.name : 'Hydrogen Demo Store'} />
        </Suspense>
        <main role="main" id="mainContent" className="flex-grow">
          <Suspense fallback={null}>{children}</Suspense>
        </main>
        <Footer />
      </div>
    </LocalizationProvider>
  );
}

const QUERY = gql`
  query layoutContent($language: LanguageCode) @inContext(language: $language) {
    shop {
      name
    }
  }
`;
