import {vi} from 'vitest';
import {gql} from '../graphql-tag.js';
import {injectGraphQLTracker, TIMEOUT_MS} from '../graphql-tracker.js';

const query = gql`
  query shopName {
    shop {
      __typename
      id
      title: name
      summary: description
      moneyFormat
      paymentSettings {
        __typename
        ...CodesFragment
        supportedDigitalWallets
      }
    }
    products {
      edges {
        node {
          handle
          variants {
            edges {
              node {
                title
                compareAtPriceV2 {
                  amount
                }
              }
            }
          }
        }
      }
    }
  }

  fragment CodesFragment on PaymentSettings {
    countryCode
    currencyCode
  }
`;

const getData = () => ({
  data: {
    shop: {
      id: 'id',
      title: 'aliased name',
      summary: 'description',
      moneyFormat: 'moneyFormat',
      paymentSettings: {
        countryCode: 'ES',
        currencyCode: 'EUR',
        supportedDigitalWallets: ['ANDROID_PAY', 'SHOPIFY_PAY'],
      },
    },
    products: {
      edges: [
        {
          node: {
            handle: 'handle-0',
            variants: {
              edges: [{node: {title: 'title-0', compareAtPriceV2: null}}],
            },
          },
        },
        {
          node: {
            handle: 'handle-1',
            variants: {
              edges: [
                {node: {title: 'title-1', compareAtPriceV2: {amount: 12}}},
              ],
            },
          },
        },
      ],
    },
  },
});

describe('GraphQL Tracker', () => {
  vi.useFakeTimers();

  it('warns about unused properties', () => {
    let unusedData = {
      queryName: '',
      properties: [] as string[],
    };

    const dataMock = getData();
    const manualCheck = injectGraphQLTracker({
      query,
      data: dataMock,
      onUnusedData: (params: typeof unusedData) => (unusedData = params),
    });

    // Read stuff via direct access or destructuring
    dataMock.data.shop.id + dataMock.data.shop.title;

    vi.advanceTimersByTime(TIMEOUT_MS / 2);

    const {
      data: {
        shop: {
          // @ts-ignore
          paymentSettings: {countryCode},
        },
        products: {
          edges: [
            // @ts-ignore
            firstProductEdge,
            {
              // @ts-ignore
              node: {handle},
            },
          ],
        },
      },
    } = dataMock;

    vi.advanceTimersByTime(TIMEOUT_MS / 2 + 100);
    // Not enough time since last read
    expect(unusedData.properties.length).toEqual(0);

    vi.advanceTimersByTime(TIMEOUT_MS / 2);
    // Enough time since last read
    expect(unusedData.properties.length).toBeGreaterThan(0);

    expect(unusedData.queryName).toEqual('shopName');

    // Properties that are not used:
    expect(unusedData.properties).toContain('shop.summary');
    expect(unusedData.properties).toContain('shop.moneyFormat');
    expect(unusedData.properties).toContain(
      'shop.paymentSettings.currencyCode'
    );
    expect(unusedData.properties).toContain('products.variants.title');
    expect(unusedData.properties).toContain(
      'products.variants.compareAtPriceV2.amount'
    );
    expect(unusedData.properties).toContain(
      'shop.paymentSettings.supportedDigitalWallets'
    );

    // Properties that have been read or are excluded for any reason:
    expect(unusedData.properties).not.toContain('shop.id');
    expect(unusedData.properties).not.toContain('shop.__typename'); // Ignored
    expect(unusedData.properties).not.toContain('shop.name'); // Aliased to title
    expect(unusedData.properties).not.toContain('shop.title');
    expect(unusedData.properties).not.toContain('shop.description'); // Alaised to summary
    expect(unusedData.properties).not.toContain(
      'shop.paymentSettings.countryCode'
    );
    expect(unusedData.properties).not.toContain(
      'shop.paymentSettings.__typename'
    ); // Ignored
    expect(unusedData.properties).not.toContain('products.handle');

    // Reading properties after the timeout is finished won't trigger a refresh
    firstProductEdge.node.variants.edges[0].node.title;
    vi.advanceTimersByTime(TIMEOUT_MS + 100);
    expect(unusedData.properties).toContain('products.variants.title');

    manualCheck();
    expect(unusedData.properties).not.toContain('products.variants.title');

    // Make sure the data has not been altered during the proxy injection
    expect(JSON.stringify(dataMock)).toEqual(JSON.stringify(getData()));
  });
});
