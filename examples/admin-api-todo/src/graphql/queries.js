import {gql} from '@shopify/hydrogen';
import {Metafield} from './fragments';

export const SHOP_METAFIELDS_QUERY = gql`
  ${Metafield}
  query Shop {
    shop {
      metafields(first: 100) {
        edges {
          node {
            ...Metafield
          }
        }
      }
    }
  }
`;
