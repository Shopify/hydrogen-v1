import React from 'react';
import {mount} from '@shopify/react-testing';
import {CartLineProvider} from '../../CartLineProvider';
import {CartLineImage} from '../CartLineImage.client';
import {CART_LINE} from '../../CartLineProvider/tests/fixtures';
import {Image} from '../../Image';

it('displays the image', () => {
  const line = {
    ...CART_LINE,
    merchandise: {
      ...CART_LINE.merchandise,
      image: {
        url: 'https://cdn.shopify.com/someimage.jpg',
        altText: 'The product',
        width: 200,
        height: 300,
      },
    },
  };

  const wrapper = mount(
    <CartLineProvider line={line}>
      <CartLineImage />
    </CartLineProvider>
  );

  expect(wrapper).toContainReactComponent(Image, {
    data: line.merchandise.image,
  });
});

it('allows passthrough props', () => {
  const line = {
    ...CART_LINE,
    merchandise: {
      ...CART_LINE.merchandise,
      image: {
        url: 'https://cdn.shopify.com/someimage.jpg',
        altText: 'The product',
      },
    },
  };

  const wrapper = mount(
    <CartLineProvider line={line}>
      <CartLineImage className="w-full" />
    </CartLineProvider>
  );

  expect(wrapper).toContainReactComponent(Image, {
    data: line.merchandise.image,
    className: 'w-full',
  });
});

it('displays nothing if there is no image', () => {
  const wrapper = mount(
    <CartLineProvider line={CART_LINE}>
      <CartLineImage />
    </CartLineProvider>
  );

  expect(wrapper).not.toContainReactComponent(Image);
});
