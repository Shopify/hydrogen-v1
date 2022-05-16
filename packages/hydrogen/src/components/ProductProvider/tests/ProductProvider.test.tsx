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
      // @ts-expect-error mock data doesn't fully match
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
      })
    );
  });

  it('renders its children', () => {
    const Children = () => null;
    const productProvider = mountWithProviders(
      // @ts-expect-error mock data doesn't fully match
      <ProductProvider data={getProduct()} initialVariantId="">
        <Children />
      </ProductProvider>
    );

    expect(productProvider).toContainReactComponent(Children);
  });
});
