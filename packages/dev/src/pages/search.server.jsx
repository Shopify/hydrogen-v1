import {useLocation} from 'react-router-dom';
import {useShopQuery, Money, Image} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import Layout from '../components/Layout.server';
import ProductCard from '../components/ProductCard.server';
import SearchForm from '../components/SearchForm.client';

export default function Search({query}) {
  const {search} = useLocation();
  const searchQuery = query || new URLSearchParams(search).get('query');

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Search</h1>
      <SearchForm query={searchQuery} />
      {searchQuery && <SearchResults query={searchQuery} />}
    </Layout>
  );
}

function SearchResults({query}) {
  const {data} = useShopQuery({query: QUERY, variables: {query}});

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
    variants(first: 1) {
      edges {
        node {
          availableForSale
          image {
            ...ImageFragment
          }
          priceV2 {
            ...MoneyFragment
          }
          compareAtPriceV2 {
            ...MoneyFragment
          }
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

  ${Image.Fragment}
  ${Money.Fragment}
`;
