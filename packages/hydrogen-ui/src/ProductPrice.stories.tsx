import * as React from 'react';
import type {Story} from '@ladle/react';
import {ProductPrice} from './ProductPrice.js';
import {getProduct, getVariant} from './ProductProvider.test.helpers.js';

type ProductPriceProps = React.ComponentPropsWithoutRef<typeof ProductPrice>;

const Template: Story<ProductPriceProps> = (props) => {
  return (
    <>
      <div>product.priceRange will be in the $100s</div>
      <div>product.compareAtPriceRange will be in the $200s</div>
      <div>
        product.variant will be in the $300s, and is activated by setting
        variantId to &quot;123&quot;
      </div>
      <hr />
      <ProductPrice
        {...props}
        data={getProduct({
          priceRange: {
            maxVariantPrice: {
              currencyCode: 'USD',
              amount: '110',
            },
            minVariantPrice: {
              currencyCode: 'USD',
              amount: '100',
            },
          },
          compareAtPriceRange: {
            maxVariantPrice: {
              currencyCode: 'USD',
              amount: '210',
            },
            minVariantPrice: {
              currencyCode: 'USD',
              amount: '200',
            },
          },
          variants: {
            nodes: [
              getVariant({
                id: '123',
                priceV2: {
                  currencyCode: 'USD',
                  amount: '300',
                },
                compareAtPriceV2: {
                  currencyCode: 'USD',
                  amount: '310',
                },
                unitPrice: {
                  currencyCode: 'USD',
                  amount: '320',
                },
              }),
            ],
          },
        })}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  withoutCurrency: false,
  withoutTrailingZeros: false,
  variantId: '',
};
Default.argTypes = {
  priceType: {
    options: ['regular', 'compareAt'],
    control: {type: 'radio'},
    defaultValue: 'regular',
  },
  valueType: {
    options: ['max', 'min', 'unit'],
    control: {type: 'radio'},
    defaultValue: 'min',
  },
};
