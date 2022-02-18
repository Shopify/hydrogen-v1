import React from 'react';
import {getProduct} from '../../../utilities/tests/product';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';
import {Money} from '../../Money';
import {ProductProvider} from '../../ProductProvider';
import {SelectedVariantPrice} from '../SelectedVariantPrice.client';

describe('<SelectedVariantPrice />', () => {
  it('renders <Money /> with the selected variant regular price by default', () => {
    const product = getProduct();
    const selectedVariant = product.variants.edges[0].node;
    const price = mountWithProviders(
      <ProductProvider data={product} initialVariantId={selectedVariant.id}>
        <SelectedVariantPrice />
      </ProductProvider>
    );

    expect(price).toContainReactComponent(Money, {
      data: selectedVariant.priceV2,
    });
  });

  it('renders <Money /> with the selected variant compareAt price when `priceType` is `compareAt`', () => {
    const product = getProduct();
    const selectedVariant = product.variants.edges[0].node;
    const price = mountWithProviders(
      <ProductProvider data={product} initialVariantId={selectedVariant.id}>
        <SelectedVariantPrice priceType="compareAt" />
      </ProductProvider>
    );

    expect(price).toContainReactComponent(Money, {
      data: selectedVariant.compareAtPriceV2,
    });
  });

  it('supports passthrough props', () => {
    const product = getProduct();
    const selectedVariant = product.variants.edges[0].node;
    const price = mountWithProviders(
      <ProductProvider data={product} initialVariantId={selectedVariant.id}>
        <SelectedVariantPrice className="strikethrough" />
      </ProductProvider>
    );

    expect(price).toContainReactComponent(Money, {
      className: 'strikethrough',
    });
  });
});
