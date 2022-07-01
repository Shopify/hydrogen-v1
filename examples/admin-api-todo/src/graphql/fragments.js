import {gql} from '@shopify/hydrogen';

export const Metafield = gql`
  fragment Metafield on Metafield {
    id
    value
    namespace
    key
    updatedAt
    createdAt
    ownerType
  }
`;
