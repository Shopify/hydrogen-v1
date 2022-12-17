import {createMountableHook} from '../../../utilities/tests/createMountableHook.js';
import {CurrencyCode} from '../../../storefront-api-types.js';
import {useMoney} from '../index.js';

const mountUseMoney = createMountableHook(useMoney);

// this has already been migrated to Vitest in storefront-kit-react; no need to migrate it here as well
describe(`useMoney`, () => {
  it('returns an object with all of the details about the money', async () => {
    const money = await mountUseMoney({
      amount: '19.99',
      currencyCode: CurrencyCode.Usd,
    });

    expect(money).toEqual({
      amount: '19.99',
      currencyCode: 'USD',
      currencyName: 'US dollars',
      currencyNarrowSymbol: '$',
      currencySymbol: '$',
      localizedString: '$19.99',
      original: {
        amount: '19.99',
        currencyCode: CurrencyCode.Usd,
      },
      parts: [
        {type: 'currency', value: '$'},
        {type: 'integer', value: '19'},
        {type: 'decimal', value: '.'},
        {type: 'fraction', value: '99'},
      ],
      withoutTrailingZeros: '$19.99',
      withoutTrailingZerosAndCurrency: '19.99',
    });
  });

  it(`removes trailing zeros when necessary`, async () => {
    const money = await mountUseMoney({
      amount: '19.00',
      currencyCode: CurrencyCode.Usd,
    });

    expect(money).toEqual({
      amount: '19.00',
      currencyCode: 'USD',
      currencyName: 'US dollars',
      currencyNarrowSymbol: '$',
      currencySymbol: '$',
      localizedString: '$19.00',
      original: {
        amount: '19.00',
        currencyCode: CurrencyCode.Usd,
      },
      parts: [
        {type: 'currency', value: '$'},
        {type: 'integer', value: '19'},
        {type: 'decimal', value: '.'},
        {type: 'fraction', value: '00'},
      ],
      withoutTrailingZeros: '$19',
      withoutTrailingZerosAndCurrency: '19',
    });
  });
});
