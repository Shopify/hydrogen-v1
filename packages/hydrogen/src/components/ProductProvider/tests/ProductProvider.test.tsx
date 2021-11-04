import React from 'react';
import {ProductContext} from '../context';
import {ProductProvider} from '../ProductProvider.client';
import {mountWithShopifyProvider} from '../../../utilities/tests/shopify_provider';
import {getProduct} from '../../../utilities/tests/product';
import {flattenConnection} from '../../../utilities';

describe('<ProductProvider />', () => {
  it('sets up a product context for the provided product', () => {
    const product = getProduct();
    const productProvider = mountWithShopifyProvider(
      <ProductProvider product={product} initialVariantId="">
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
    const productProvider = mountWithShopifyProvider(
      <ProductProvider product={getProduct()} initialVariantId="">
        <Children />
      </ProductProvider>
    );

    expect(productProvider).toContainReactComponent(Children);
  });
});
