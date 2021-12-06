import {useShopQuery} from '@shopify/hydrogen';
import gql from 'graphql-tag';

export default function Index() {
  const {data} = useShopQuery({
    query: QUERY,
  });

  return <p>Hello {data.shop.name}</p>;
}

const QUERY = gql`
  query indexContent {
    shop {
      name
    }
  }
`;
