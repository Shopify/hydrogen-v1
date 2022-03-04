import React from 'react';
import {getProduct} from '../../../utilities/tests/product';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';
import {ProductProvider} from '../../ProductProvider';
import {ProductTitle} from '../ProductTitle.client';
import {Link} from '../../Link/index';

describe('<ProductTitle />', () => {
  it('renders the product title in a <span> by default', () => {
    const product = getProduct();
    const price = mountWithProviders(
      <ProductProvider data={product} initialVariantId="">
        <ProductTitle />
      </ProductProvider>
    );

    expect(price).toContainReactComponent('span', {
      children: product.title,
    });
  });

  it('renders the product title in the HTML element specified by the `as` prop', () => {
    const product = getProduct();
    const price = mountWithProviders(
      <ProductProvider data={product} initialVariantId="">
        <ProductTitle as="p" />
      </ProductProvider>
    );

    expect(price).toContainReactComponent('p', {
      children: product.title,
    });
  });

  it(`does prop validation when using a component for the 'as' prop`, () => {
    const product = getProduct();
    const price = mountWithProviders(
      <ProductProvider data={product} initialVariantId="">
        <ProductTitle as={Link} to="/test" />
      </ProductProvider>
    );

    expect(price).toContainReactComponent(Link, {
      to: '/test',
    });
  });
});
