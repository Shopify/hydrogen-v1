// eslint-disable-next-line node/no-extraneous-import
import {CurrencyCode, MoneyV2} from '../../storefront-api-types.js';

export function getPrice(price: Partial<MoneyV2> = {}) {
  return {
    currencyCode: price.currencyCode ?? CurrencyCode.Cad,
    amount: price.amount ?? '9.99',
  };
}
