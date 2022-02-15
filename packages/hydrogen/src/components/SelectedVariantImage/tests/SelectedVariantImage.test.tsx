import React from 'react';
import {getProduct} from '../../../utilities/tests/product';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';
import {ProductProvider} from '../../ProductProvider';
import {SelectedVariantImage} from '../SelectedVariantImage.client';
import {Image} from '../../Image';

describe('<SelectedVariantImage />', () => {
  it("renders <Image /> with the selected variant's image", () => {
    const product = getProduct();
    const selectedVariant = product.variants.edges[0].node;
    const wrapper = mountWithProviders(
      <ProductProvider data={product} initialVariantId={selectedVariant.id}>
        <SelectedVariantImage />
      </ProductProvider>
    );

    expect(wrapper).toContainReactComponent(Image, {
      data: selectedVariant.image,
    });
  });

  it('allows passthrough props', () => {
    const product = getProduct();
    const selectedVariant = product.variants.edges[0].node;
    const wrapper = mountWithProviders(
      <ProductProvider data={product} initialVariantId={selectedVariant.id}>
        <SelectedVariantImage className="w-full" />
      </ProductProvider>
    );

    expect(wrapper).toContainReactComponent(Image, {
      data: selectedVariant.image,
      className: 'w-full',
    });
  });

  it('displays nothing if there is no variant image', () => {
    const product = getProduct();
    const selectedVariant = product.variants.edges[0].node;
    selectedVariant.image = undefined;

    const wrapper = mountWithProviders(
      <ProductProvider data={product} initialVariantId={selectedVariant.id}>
        <SelectedVariantImage />
      </ProductProvider>
    );

    expect(wrapper).not.toContainReactComponent(Image);
  });
});
