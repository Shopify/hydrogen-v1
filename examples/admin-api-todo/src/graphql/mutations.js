import {gql} from '@shopify/hydrogen';

export const CREATE_METAFIELD_DEFINITION_MUTATION = gql`
  mutation MetafieldDefinitionMigrateMutation(
    $definition: MetafieldDefinitionInput!
  ) {
    metafieldDefinitionCreate(definition: $definition) {
      createdDefinition {
        id
        __typename
        key
      }
      userErrors {
        message
        field
        __typename
      }
      __typename
    }
  }
`;

export const DELETE_METAFIELD_MUTATION = gql`
  mutation metafieldDelete($input: MetafieldDeleteInput!) {
    metafieldDelete(input: $input) {
      deletedId
      userErrors {
        field
        message
      }
    }
  }
`;
