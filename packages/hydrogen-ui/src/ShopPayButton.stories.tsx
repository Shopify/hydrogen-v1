import * as React from 'react';
import type {Story} from '@ladle/react';
import {ShopPayButton} from './ShopPayButton.js';

type ButtonProps = React.ComponentPropsWithoutRef<typeof ShopPayButton>;

const Template: Story<ButtonProps> = (props) => <ShopPayButton {...props} />;

export const NoQuantity = Template.bind({});
NoQuantity.args = {
  variantIds: ['123', '456'],
  className: '',
  width: '',
};

export const Quantities = Template.bind({});
Quantities.args = {
  variantIdsAndQuantities: [{id: '123', quantity: 2}],
  className: '',
  width: '',
};
