import {PartialDeep} from 'type-fest';
import {ProductConnection} from './storefront-api-types.js';
import {flattenConnection} from './flatten-connection.js';
import {vi} from 'vitest';

describe('flattenConnection', () => {
  it('flattens legacy edges', () => {
    const connection: PartialDeep<ProductConnection> = {
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
    const connection: PartialDeep<ProductConnection> = {
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

  it(`returns an empty array when neither edges.nodes or nodes exists`, () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(flattenConnection({})).toEqual([]);
    expect(console.warn).toHaveBeenCalled();
  });
});
