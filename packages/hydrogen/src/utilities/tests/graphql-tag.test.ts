import {gql} from '../graphql-tag.js';
import ast from 'graphql-tag';

describe('GraphQL Tag', () => {
  it('removes extra spaces and comments', () => {
    expect(gql`
      # Outer comment
      query {
        # Inner comment
        something # Inlined comment
      }
    `).toEqual('query { something }');
  });

  it('supports fragments', () => {
    const fragment = gql`
      fragment Test on Whatever {
        key
      }
    `;

    const query = gql`
      query {
        something {
          ...Test
        }
      }
      ${fragment}
    `;

    expect(query).toEqual(
      'query { something { ...Test } } fragment Test on Whatever { key }'
    );

    expect(ast`${query}`).toMatchObject({
      kind: 'Document',
      definitions: [
        {kind: 'OperationDefinition'},
        {kind: 'FragmentDefinition'},
      ],
    });
  });
});
