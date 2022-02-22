import React from 'react';
import {getProduct} from '../../../utilities/tests/product';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';
import {Money} from '../../Money';
import {UnitPrice} from '../../UnitPrice';
import {ProductProvider} from '../../ProductProvider';
import {ProductPrice} from '../ProductPrice.client';

describe('<ProductPrice />', () => {
  describe('variantId prop is provided', () => {
    it("renders <Money /> with the variant's price", () => {
      const product = getProduct();
      const variant = product.variants.edges[0].node;
      const price = mountWithProviders(
        <ProductProvider data={product} initialVariantId="">
          <ProductPrice variantId={variant.id} />
        </ProductProvider>
      );

      expect(price).toContainReactComponent(Money, {
        data: variant.priceV2,
      });
    });

    it("renders <Money /> with the variant's minimum compareAt price", () => {
      const product = getProduct();
      const variant = product.variants.edges[0].node;
      const price = mountWithProviders(
        <ProductProvider data={product} initialVariantId="">
          <ProductPrice priceType="compareAt" variantId={variant.id} />
        </ProductProvider>
      );

      expect(price).toContainReactComponent(Money, {
        data: variant.compareAtPriceV2,
      });
    });

    it('renders <UnitPrice /> when valueType is `unit`', () => {
      const product = getProduct();
      const variant = product.variants.edges[0].node;
      const component = mountWithProviders(
        <ProductProvider data={product}>
          <ProductPrice valueType="unit" variantId={variant.id} />
        </ProductProvider>
      );

      expect(component).toContainReactComponent(UnitPrice, {
        data: variant.unitPrice,
        measurement: variant.unitPriceMeasurement,
      });
    });
  });

  it("renders <Money /> with the product's minimum regular price by default", () => {
    const product = getProduct();
    const price = mountWithProviders(
      <ProductProvider data={product} initialVariantId="">
        <ProductPrice />
      </ProductProvider>
    );

    expect(price).toContainReactComponent(Money, {
      data: product.priceRange.minVariantPrice,
    });
  });

  it("renders <Money /> with the product's maximum regular price when `valueType` is `max`", () => {
    const product = getProduct();
    const price = mountWithProviders(
      <ProductProvider data={product} initialVariantId="">
        <ProductPrice valueType="max" />
      </ProductProvider>
    );

    expect(price).toContainReactComponent(Money, {
      data: product.priceRange.maxVariantPrice,
    });
  });

  it("renders <Money /> with the product's minimum compareAt price when the `priceType` is `compareAt`", () => {
    const product = getProduct();
    const price = mountWithProviders(
      <ProductProvider data={product} initialVariantId="">
        <ProductPrice priceType="compareAt" />
      </ProductProvider>
    );

    expect(price).toContainReactComponent(Money, {
      data: product.compareAtPriceRange.minVariantPrice,
    });
  });

  it("renders <Money /> with the product's maximum compareAt price when `valueType` is `max` and `priceType` is `compareAt`", () => {
    const product = getProduct();
    const price = mountWithProviders(
      <ProductProvider data={product} initialVariantId="">
        <ProductPrice valueType="max" priceType="compareAt" />
      </ProductProvider>
    );

    expect(price).toContainReactComponent(Money, {
      data: product.compareAtPriceRange.maxVariantPrice,
    });
  });

  it('supports passthrough props', () => {
    const price = mountWithProviders(
      <ProductProvider data={getProduct()} initialVariantId="">
        <ProductPrice className="emphasized" />
      </ProductProvider>
    );

    expect(price).toContainReactComponent(Money, {
      className: 'emphasized',
    });
  });
});
