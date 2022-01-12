import React from 'react';
import {getProduct} from '../../../utilities/tests/product';
import {
  mountWithProviders,
  getShopifyConfig,
} from '../../../utilities/tests/shopifyMount';
import {Money} from '../../Money';
import {ProductProvider} from '../../ProductProvider';
import {SelectedVariantPrice} from '../SelectedVariantPrice.client';
import {setShopifyConfig} from '../../../foundation/useShop/use-shop';

setShopifyConfig(getShopifyConfig());

describe('<SelectedVariantPrice />', () => {
  it('renders <Money /> with the selected variant regular price by default', () => {
    const product = getProduct();
    const selectedVariant = product.variants.edges[0].node;
    const price = mountWithProviders(
      <ProductProvider product={product} initialVariantId={selectedVariant.id}>
        <SelectedVariantPrice />
      </ProductProvider>
    );

    expect(price).toContainReactComponent(Money, {
      money: selectedVariant.priceV2,
    });
  });

  it('renders <Money /> with the selected variant compareAt price when `priceType` is `compareAt`', () => {
    const product = getProduct();
    const selectedVariant = product.variants.edges[0].node;
    const price = mountWithProviders(
      <ProductProvider product={product} initialVariantId={selectedVariant.id}>
        <SelectedVariantPrice priceType="compareAt" />
      </ProductProvider>
    );

    expect(price).toContainReactComponent(Money, {
      money: selectedVariant.compareAtPriceV2,
    });
  });

  it('renders its children', () => {
    const product = getProduct();
    const selectedVariant = product.variants.edges[0].node;
    const price = mountWithProviders(
      <ProductProvider product={product} initialVariantId={selectedVariant.id}>
        <SelectedVariantPrice>
          {({amount}) => {
            return <p>{`The amount is ${amount}`}</p>;
          }}
        </SelectedVariantPrice>
      </ProductProvider>
    );

    expect(price).toContainReactComponent('p', {
      children: `The amount is ${selectedVariant.priceV2.amount}`,
    });
  });

  it('supports passthrough props', () => {
    const product = getProduct();
    const selectedVariant = product.variants.edges[0].node;
    const price = mountWithProviders(
      <ProductProvider product={product} initialVariantId={selectedVariant.id}>
        <SelectedVariantPrice className="strikethrough" />
      </ProductProvider>
    );

    expect(price).toContainReactComponent(Money, {
      className: 'strikethrough',
    });
  });
});
