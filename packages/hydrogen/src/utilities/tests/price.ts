// eslint-disable-next-line node/no-extraneous-import
import faker from 'faker';
import {CurrencyCode, MoneyV2} from '../../graphql/types/types';

export function getPrice(price: Partial<MoneyV2> = {}) {
  return {
    currencyCode: price.currencyCode ?? CurrencyCode.Cad,
    amount: price.amount ?? faker.finance.amount(),
  };
}
