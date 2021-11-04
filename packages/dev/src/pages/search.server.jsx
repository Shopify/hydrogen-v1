import {useEffect, useMemo, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useShopQuery, MediaFileFragment} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import Layout from '../components/Layout.server';
import ProductCard from '../components/ProductCard.server';

/**
 * TODO: Refactor to a true server component.
 */
export default function Search() {
  const {search} = useLocation();
  const originalQuery = useMemo(
    () => new URLSearchParams(search).get('query'),
    [search],
  );
  const history = useHistory();
  const [query, setQuery] = useState(originalQuery);
  const [newQuery, setNewQuery] = useState(query);

  useEffect(() => {
    if (originalQuery) {
      setQuery(originalQuery);
    }
  }, [originalQuery]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Search</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setQuery(newQuery);
          history.push(`/search?query=${newQuery}`);
        }}
        className="mt-4 space-x-2"
      >
        <label htmlFor="search">Search Products:</label>
        <input
          autocomplete="off"
          name="search"
          id="search"
          type="search"
          value={newQuery}
          onChange={(event) => setNewQuery(event.target.value)}
          className="p-1"
        />
        <button type="submit" className="bg-black text-white font-bold p-1">
          Search
        </button>
      </form>
      {query && <SearchResults query={query} />}
    </Layout>
  );
}

function SearchResults({query}) {
  const {data, fetching} = useShopQuery({query: QUERY, variables: {query}});

  if (fetching) return <p>Loading...</p>;

  return (
    <>
      <h2 className="text-xl font-medium mt-8">Search results for: {query}</h2>

      {data.products.edges.length ? (
        <ul className="grid lg:grid-cols-3 gap-6 mt-4">
          {data.products.edges.map((edge) => (
            <li key={edge.node.id}>
              <ProductCard product={edge.node} />
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </>
  );
}

const QUERY = gql`
  fragment SearchProductDetails on Product {
    id
    title
    handle
    media(first: 1) {
      edges {
        node {
          ...MediaFileFragment
        }
      }
    }
  }

  query ProductSearch($query: String!) {
    products(query: $query, first: 10) {
      edges {
        node {
          ...SearchProductDetails
        }
      }
    }
  }

  ${MediaFileFragment}
`;
