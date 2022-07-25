import {PartialDeep} from 'type-fest';
import {Product} from '../../../storefront-api-types.js';
import {GraphQLConnection} from '../../../types.js';
import {flattenConnection} from '../flattenConnection.js';

describe('flattenConnection', () => {
  it('flattens legacy edges', () => {
    const connection: PartialDeep<GraphQLConnection<Product>> = {
      edges: [
        {
          node: {
            id: '1',
            title: 'Product 1',
          },
        },
        {
          node: {
            id: '2',
            title: 'Product 2',
          },
        },
      ],
    };

    expect(flattenConnection(connection)).toEqual([
      {
        id: '1',
        title: 'Product 1',
      },
      {
        id: '2',
        title: 'Product 2',
      },
    ]);
  });

  it('flattens nodes', () => {
    const connection: PartialDeep<GraphQLConnection<Product>> = {
      nodes: [
        {
          id: '1',
          title: 'Product 1',
        },
        {
          id: '2',
          title: 'Product 2',
        },
      ],
    };

    expect(flattenConnection(connection)).toEqual([
      {
        id: '1',
        title: 'Product 1',
      },
      {
        id: '2',
        title: 'Product 2',
      },
    ]);
  });
});
