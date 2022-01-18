import React from 'react';
import {getProduct} from '../../../utilities/tests/product';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';
import {Money} from '../../Money';
import {ProductProvider} from '../../ProductProvider';
import {ProductPrice} from '../ProductPrice.client';

describe('<ProductPrice />', () => {
  it("renders <Money /> with the product's minimum regular price by default", () => {
    const product = getProduct();
    const price = mountWithProviders(
      <ProductProvider product={product} initialVariantId="">
        <ProductPrice />
      </ProductProvider>
    );

    expect(price).toContainReactComponent(Money, {
      money: product.priceRange.minVariantPrice,
    });
  });

  it("renders <Money /> with the product's maximum regular price when `valueType` is `max`", () => {
    const product = getProduct();
    const price = mountWithProviders(
      <ProductProvider product={product} initialVariantId="">
        <ProductPrice valueType="max" />
      </ProductProvider>
    );

    expect(price).toContainReactComponent(Money, {
      money: product.priceRange.maxVariantPrice,
    });
  });

  it("renders <Money /> with the product's minimum compareAt price when the `priceType` is `compareAt`", () => {
    const product = getProduct();
    const price = mountWithProviders(
      <ProductProvider product={product} initialVariantId="">
        <ProductPrice priceType="compareAt" />
      </ProductProvider>
    );

    expect(price).toContainReactComponent(Money, {
      money: product.compareAtPriceRange.minVariantPrice,
    });
  });

  it("renders <Money /> with the product's maximum compareAt price when `valueType` is `max` and `priceType` is `compareAt`", () => {
    const product = getProduct();
    const price = mountWithProviders(
      <ProductProvider product={product} initialVariantId="">
        <ProductPrice valueType="max" priceType="compareAt" />
      </ProductProvider>
    );

    expect(price).toContainReactComponent(Money, {
      money: product.compareAtPriceRange.maxVariantPrice,
    });
  });

  it('renders its children', () => {
    const product = getProduct();
    const children = ({amount}) => {
      return <p>{`The amount is ${amount}`}</p>;
    };
    const price = mountWithProviders(
      <ProductProvider product={product} initialVariantId="">
        <ProductPrice>{children}</ProductPrice>
      </ProductProvider>
    );

    expect(price).toContainReactComponent('p', {
      children: `The amount is ${product.priceRange.minVariantPrice.amount}`,
    });
  });

  it('supports passthrough props', () => {
    const price = mountWithProviders(
      <ProductProvider product={getProduct()} initialVariantId="">
        <ProductPrice className="emphasized" />
      </ProductProvider>
    );

    expect(price).toContainReactComponent(Money, {
      className: 'emphasized',
    });
  });
});
