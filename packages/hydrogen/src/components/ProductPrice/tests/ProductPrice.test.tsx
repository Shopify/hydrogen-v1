import React from 'react';
import {getProduct} from '../../../utilities/tests/product.js';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount.js';
import {Money} from '../../Money/index.js';
import {ProductPrice} from '../ProductPrice.client.js';

describe('<ProductPrice />', () => {
  describe('variantId prop is provided', () => {
    it("renders <Money /> with the variant's price", () => {
      const product = getProduct();
      const variant = product?.variants?.nodes?.[0];
      const price = mountWithProviders(
        <ProductPrice data={product} variantId={variant?.id} />
      );

      expect(price).toContainReactComponent(Money, {
        data: variant?.priceV2,
      });
    });

    it("renders <Money /> with the variant's minimum compareAt price", () => {
      const product = getProduct();
      const variant = product?.variants?.nodes?.[0];
      const price = mountWithProviders(
        <ProductPrice
          data={product}
          priceType="compareAt"
          variantId={variant?.id}
        />
      );

      expect(price).toContainReactComponent(Money, {
        data: variant?.compareAtPriceV2,
      });
    });

    it('renders <Money /> with unit prices when valueType is `unit`', () => {
      const product = getProduct();
      const variant = product?.variants?.nodes?.[0];
      const component = mountWithProviders(
        <ProductPrice data={product} valueType="unit" variantId={variant?.id} />
      );

      expect(component).toContainReactComponent(Money, {
        data: variant?.unitPrice,
        measurement: variant?.unitPriceMeasurement,
      });
    });
  });

  it("renders <Money /> with the product's minimum regular price by default", () => {
    const product = getProduct();
    const price = mountWithProviders(<ProductPrice data={product} />);

    expect(price).toContainReactComponent(Money, {
      data: product.priceRange?.minVariantPrice,
    });
  });

  it("renders <Money /> with the product's maximum regular price when `valueType` is `max`", () => {
    const product = getProduct();
    const price = mountWithProviders(
      <ProductPrice data={product} valueType="max" />
    );

    expect(price).toContainReactComponent(Money, {
      data: product.priceRange?.maxVariantPrice,
    });
  });

  it("renders <Money /> with the product's minimum compareAt price when the `priceType` is `compareAt`", () => {
    const product = getProduct();
    const price = mountWithProviders(
      <ProductPrice data={product} priceType="compareAt" />
    );

    expect(price).toContainReactComponent(Money, {
      data: product.compareAtPriceRange?.minVariantPrice,
    });
  });

  it("renders <Money /> with the product's maximum compareAt price when `valueType` is `max` and `priceType` is `compareAt`", () => {
    const product = getProduct();
    const price = mountWithProviders(
      <ProductPrice data={product} valueType="max" priceType="compareAt" />
    );

    expect(price).toContainReactComponent(Money, {
      data: product.compareAtPriceRange?.maxVariantPrice,
    });
  });

  it('supports passthrough props', () => {
    const product = getProduct();
    const price = mountWithProviders(
      <ProductPrice data={product} className="emphasized" />
    );

    expect(price).toContainReactComponent(Money, {
      className: 'emphasized',
    });
  });
});
