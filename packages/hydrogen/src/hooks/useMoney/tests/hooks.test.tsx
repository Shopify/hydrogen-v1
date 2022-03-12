import {createMountableHook} from '../../../utilities/tests/createMountableHook';
import {CurrencyCode} from '../../../storefront-api-types';
import {useMoney} from '../hooks';

const mountUseMoney = createMountableHook(useMoney);

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
  });
});
