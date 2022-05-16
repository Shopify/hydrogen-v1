import React from 'react';
import {getProduct} from '../../../utilities/tests/product';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';
import {ProductProvider} from '../../ProductProvider';
import {ProductDescription} from '../ProductDescription.client';

describe('<ProductDescription/>', () => {
  it('renders <div /> with the product’s descriptionHtml', () => {
    const product = getProduct();
    const price = mountWithProviders(
      // @ts-expect-error The mock doesn't match perfectly, fix at some point
      <ProductProvider data={product} initialVariantId="">
        <ProductDescription />
      </ProductProvider>
    );

    expect(price).toContainReactComponent('div', {
      dangerouslySetInnerHTML: {
        __html: product.descriptionHtml,
      },
    });
  });

  it('allows passthrough props', () => {
    const product = getProduct();
    const price = mountWithProviders(
      // @ts-expect-error The mock doesn't match perfectly, fix at some point
      <ProductProvider data={product} initialVariantId="">
        <ProductDescription as="section" className="emphasized" />
      </ProductProvider>
    );

    expect(price).toContainReactComponent('section', {
      className: 'emphasized',
      dangerouslySetInnerHTML: {
        __html: product.descriptionHtml,
      },
    });
  });
});
