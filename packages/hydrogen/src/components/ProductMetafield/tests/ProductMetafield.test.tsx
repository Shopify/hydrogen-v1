import React from 'react';
import {getProduct, getVariant} from '../../../utilities/tests/product';
import {getRawMetafield} from '../../../utilities/tests/metafields';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';
import {ProductProvider} from '../../ProductProvider';
import {ProductMetafield} from '../ProductMetafield.client';
import {Metafield} from '../../Metafield';

describe('<ProductMetafield/>', () => {
  it('renders <Metafield /> and passes the product’s metafield data as the data prop', () => {
    const metafield = getRawMetafield({
      key: 'some_string',
      namespace: 'my_fields',
      type: 'single_line_text_field' as const,
      value: 'my value string',
    });
    const product = getProduct({
      metafields: {
        edges: [{node: metafield as any}],
      },
    });
    const wrapper = mountWithProviders(
      // @ts-expect-error mock data doesn't fully match
      <ProductProvider data={product} initialVariantId="">
        <ProductMetafield
          namespace={metafield?.namespace ?? ''}
          keyName={metafield?.key ?? ''}
        />
      </ProductProvider>
    );

    expect(wrapper).toContainReactComponent(Metafield, {
      data: expect.objectContaining(metafield),
    });
  });

  it('renders <Metafield /> and passes the variant’s metafield data as the data prop when a variantId is provided', () => {
    const variantId = '123';
    const metafield = getRawMetafield({
      key: 'some_string',
      namespace: 'my_fields',
      type: 'single_line_text_field' as const,
      value: 'my value string',
    });
    const variant = getVariant({
      id: variantId,
      metafields: {
        edges: [{node: metafield}],
      } as any,
    });
    const product = getProduct({variants: {edges: [{node: variant as any}]}});
    const wrapper = mountWithProviders(
      // @ts-expect-error mock data doesn't fully match
      <ProductProvider data={product} initialVariantId="">
        <ProductMetafield
          namespace={metafield?.namespace ?? ''}
          keyName={metafield?.key ?? ''}
          variantId={variantId}
        />
      </ProductProvider>
    );

    expect(wrapper).toContainReactComponent(Metafield, {
      data: expect.objectContaining(metafield),
    });
  });
});
