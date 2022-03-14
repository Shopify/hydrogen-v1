// eslint-disable-next-line node/no-extraneous-import
import gql from 'graphql-tag';
import {wrapInGraphQLTracker} from '../graphql-tracker';
import type {Logger} from '../log';

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
    const warnings = [] as string[];
    const log = {
      warn: (string: string) => warnings.push(string),
    } as unknown as Logger;

    const tracker = wrapInGraphQLTracker<typeof data>({query, data, log});

    // Read stuff via destructuring or direct access
    tracker.data.shop.id + tracker.data.shop.name;

    const {
      data: {
        shop: {
          // @ts-ignore
          paymentSettings: {countryCode},
        },
      },
    } = tracker;

    jest.advanceTimersByTime(2100);

    const warning = warnings.join('\n');
    expect(warning).toContain('shopName');

    expect(warning).toContain('description');
    expect(warning).toContain('moneyFormat');
    expect(warning).toContain('currencyCode');

    expect(warning).not.toContain('id');
    expect(warning).not.toContain('name');
    expect(warning).not.toContain('countryCode');
  });
});
