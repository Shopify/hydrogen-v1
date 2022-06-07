import {
  useShop,
  useShopQuery,
  flattenConnection,
  LocalizationProvider,
  CacheHours,
  gql,
} from '@shopify/hydrogen';

import Header from './Header.client';
import Footer from './Footer.server';
import Cart from './Cart.client';
import {Suspense} from 'react';

/**
 * A server component that defines a structure and organization of a page that can be used in different parts of the Hydrogen app
 */
export default function Layout({children, hero}) {
  const {languageCode} = useShop();

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      language: languageCode,
      numCollections: 3,
    },
    cache: CacheHours(),
    preload: '*',
  });
  const collections = data ? flattenConnection(data.collections) : null;
  const products = data ? flattenConnection(data.products) : null;
  const storeName = data ? data.shop.name : '';

  return (
    <LocalizationProvider preload="*">
      <div className="absolute top-0 left-0">
        <a
          href="#mainContent"
          className="p-4 focus:block sr-only focus:not-sr-only"
        >
          Skip to content
        </a>
      </div>
      <div className="min-h-screen max-w-screen text-gray-700 font-sans">
        {/* TODO: Find out why Suspense needs to be here to prevent hydration errors. */}
        <Suspense fallback={null}>
          <Header collections={collections} storeName={storeName} />
          <Cart />
        </Suspense>
        <main role="main" id="mainContent" className="relative bg-gray-50">
          {hero}
          <div className="mx-auto max-w-7xl p-4 md:py-5 md:px-8">
            <Suspense fallback={null}>{children}</Suspense>
          </div>
        </main>
        <Footer collection={collections[0]} product={products[0]} />
      </div>
    </LocalizationProvider>
  );
}

const QUERY = gql`
  query layoutContent($language: LanguageCode, $numCollections: Int!)
  @inContext(language: $language) {
    shop {
      name
    }
    collections(first: $numCollections) {
      edges {
        node {
          description
          handle
          id
          title
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
    products(first: 1) {
      edges {
        node {
          handle
        }
      }
    }
  }
`;
