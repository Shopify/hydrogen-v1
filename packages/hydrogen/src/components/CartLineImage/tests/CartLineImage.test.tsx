import React from 'react';
import {mount} from '@shopify/react-testing';
import {CartLineProvider} from '../../CartLineProvider/index.js';
import {CartLineImage} from '../CartLineImage.client.jsx';
import {CART_LINE} from '../../CartLineProvider/tests/fixtures.js';
import {Image} from '../../Image/index.js';

const cartMerchandiseImage = {
  url: 'https://cdn.shopify.com/someimage.jpg',
  altText: 'The product',
  width: 200,
  height: 300,
};

describe(`<CartLineImage />`, () => {
  it('displays the image', () => {
    const line = {
      ...CART_LINE,
      merchandise: {
        ...CART_LINE.merchandise,
        image: {...cartMerchandiseImage},
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
          ...cartMerchandiseImage,
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

  // eslint-disable-next-line jest/expect-expect
  it.skip(`typescript types`, () => {
    // this test is actually just using //@ts-expect-error as the assertion, and don't need to execute in order to have TS validation on them
    // I don't love this idea, but at the moment I also don't have other great ideas for how to easily test our component TS types

    // no errors in these situations
    <CartLineImage />;

    // @ts-expect-error no need to pass data
    <CartLineImage data={{}} />;
    // @ts-expect-error no need to pass src
    <CartLineImage src="" />;

    // @ts-expect-error foo is invalid
    <CartLineImage data={{url: ''}} foo="bar" />;
  });
});
