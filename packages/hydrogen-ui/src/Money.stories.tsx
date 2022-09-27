import * as React from 'react';
import type {Story} from '@ladle/react';
import {Money} from './Money.js';
import type {UnitPriceMeasurementMeasuredUnit} from './storefront-api-types.js';

type MoneyProps = React.ComponentPropsWithRef<typeof Money>;

const Template: Story<{
  'data.amount': MoneyProps['data']['amount'];
  'data.currencyCode': MoneyProps['data']['currencyCode'];
  withoutCurrency: MoneyProps['withoutCurrency'];
  withoutTrailingZeros: MoneyProps['withoutTrailingZeros'];
  measurementSeparator: MoneyProps['measurementSeparator'];
  'measurement.referenceUnit': UnitPriceMeasurementMeasuredUnit;
}> = (props) => {
  const finalProps: MoneyProps = {
    data: {
      amount: props['data.amount'] ?? '100',
      currencyCode: props['data.currencyCode'] ?? 'USD',
    },
    withoutCurrency: props.withoutCurrency,
    withoutTrailingZeros: props.withoutTrailingZeros,
    measurementSeparator: props.measurementSeparator,
    ...(props['measurement.referenceUnit']
      ? {
          measurement: {
            referenceUnit: props['measurement.referenceUnit'],
          },
        }
      : {}),
  };
  return <Money {...finalProps} />;
};

export const Default = Template.bind({});
Default.args = {
  'data.amount': '100',
  'data.currencyCode': 'USD',
  withoutCurrency: false,
  withoutTrailingZeros: false,
  measurementSeparator: '/',
  'measurement.referenceUnit': '',
};
