import React from 'react';
import {ProductContext} from '../context';
import {ProductProvider} from '../ProductProvider.client';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';
import {getProduct} from '../../../utilities/tests/product';
import {flattenConnection} from '../../../utilities';

describe('<ProductProvider />', () => {
  it('sets up a product context for the provided product', () => {
    const product = getProduct();
    const productProvider = mountWithProviders(
      <ProductProvider data={product} initialVariantId="">
        Hello world
      </ProductProvider>
    );

    expect(productProvider).toProvideReactContext(
      ProductContext,
      expect.objectContaining({
        id: product.id,
        handle: product.handle,
        title: product.title,
        descriptionHtml: product.descriptionHtml,
        mediaConnection: product.media,
        media: flattenConnection(product.media),
        variantsConnection: product.variants,
        variants: flattenConnection(product.variants as any),
        priceRange: product.priceRange,
        compareAtPriceRange: product.compareAtPriceRange,
        options: expect.any(Object),
        selectedVariant: undefined,
        selectedOptions: expect.any(Object),
        selectedSellingPlan: undefined,
        selectedSellingPlanAllocation: undefined,
        sellingPlanGroups: [],
        setSelectedVariant: expect.any(Function),
        setSelectedOptions: expect.any(Function),
        setSelectedOption: expect.any(Function),
        isOptionInStock: expect.any(Function),
        setSelectedSellingPlan: expect.any(Function),
      })
    );
  });

  it('renders its children', () => {
    const Children = () => null;
    const productProvider = mountWithProviders(
      <ProductProvider data={getProduct()} initialVariantId="">
        <Children />
      </ProductProvider>
    );

    expect(productProvider).toContainReactComponent(Children);
  });
});
