import {renderHook} from '@testing-library/react';
import {useMoney} from './useMoney.js';

describe(`useMoney`, () => {
  it('returns an object with all of the details about the money', () => {
    const {result} = renderHook(() =>
      useMoney({
        amount: '19.99',
        currencyCode: 'USD',
      })
    );

    expect(result.current).toEqual({
      amount: '19.99',
      currencyCode: 'USD',
      currencyName: 'US dollars',
      currencyNarrowSymbol: '$',
      currencySymbol: '$',
      localizedString: '$19.99',
      original: {
        amount: '19.99',
        currencyCode: 'USD',
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

  it(`removes trailing zeros when necessary`, () => {
    const {result} = renderHook(() =>
      useMoney({
        amount: '19.00',
        currencyCode: 'USD',
      })
    );

    expect(result.current).toEqual({
      amount: '19.00',
      currencyCode: 'USD',
      currencyName: 'US dollars',
      currencyNarrowSymbol: '$',
      currencySymbol: '$',
      localizedString: '$19.00',
      original: {
        amount: '19.00',
        currencyCode: 'USD',
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
