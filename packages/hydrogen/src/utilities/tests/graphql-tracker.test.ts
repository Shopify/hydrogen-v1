// eslint-disable-next-line node/no-extraneous-import
import gql from 'graphql-tag';
import {wrapInGraphQLTracker, TIMEOUT_MS} from '../graphql-tracker';

const query = gql`
  query shopName {
    shop {
      id
      name
      description
      moneyFormat
      paymentSettings {
        countryCode
        currencyCode
      }
    }
  }
`;

const data = {
  data: {
    shop: {
      id: 'id',
      name: 'name',
      description: 'description',
      moneyFormat: 'moneyFormat',
      paymentSettings: {
        countryCode: 'ES',
        currencyCode: 'EUR',
      },
    },
  },
};

describe('GraphQL Tracker', () => {
  jest.useFakeTimers();

  it('warns about unused properties', () => {
    let unusedData: null | {queryName: string; properties: string[]} = null;

    const tracker = wrapInGraphQLTracker<typeof data>({
      query,
      data,
      onUnusedData: (params) => (unusedData = params),
    });

    // Read stuff via destructuring or direct access
    tracker.data.shop.id + tracker.data.shop.name;

    jest.advanceTimersByTime(TIMEOUT_MS / 2);

    const {
      data: {
        shop: {
          // @ts-ignore
          paymentSettings: {countryCode},
        },
      },
    } = tracker;

    jest.advanceTimersByTime(TIMEOUT_MS / 2 + 100);
    // Not enough time since last read
    expect(unusedData).toBeFalsy();
    jest.advanceTimersByTime(TIMEOUT_MS / 2);
    // Enough time since last read
    expect(unusedData).toBeTruthy();

    const {queryName, properties} = unusedData!;

    expect(queryName).toEqual('shopName');

    expect(properties).toContain('description');
    expect(properties).toContain('moneyFormat');
    expect(properties).toContain('currencyCode');

    expect(properties).not.toContain('id');
    expect(properties).not.toContain('name');
    expect(properties).not.toContain('countryCode');
  });
});
