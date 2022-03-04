import React from 'react';
import {ProductOptionsContext} from '../context';
import {ProductOptionsProvider} from '../ProductOptionsProvider.client';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';

describe('<ProductOptionsProvider />', () => {
  it('sets up a product context for the provided product options', () => {
    const productOptionsProvider = mountWithProviders(
      <ProductOptionsProvider initialVariantId="">
        Hello world
      </ProductOptionsProvider>
    );

    expect(productOptionsProvider).toProvideReactContext(
      ProductOptionsContext,
      expect.objectContaining({
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
      <ProductOptionsProvider initialVariantId="">
        <Children />
      </ProductOptionsProvider>
    );

    expect(productProvider).toContainReactComponent(Children);
  });
});
