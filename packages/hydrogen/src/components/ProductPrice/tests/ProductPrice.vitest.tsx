import React from 'react';
import {render, screen} from '@testing-library/react';
import {getProduct} from '../../../utilities/tests/product.js';
import {ProductPrice} from '../ProductPrice.client.js';
import {ShopifyTestProviders} from '../../../utilities/tests/provider-helpers.js';

describe('<ProductPrice />', () => {
  describe('variantId prop is provided', () => {
    it("renders <Money /> with the variant's price", () => {
      const product = getProduct();
      const variant = product?.variants?.nodes?.[0];
      render(<ProductPrice data={product} variantId={variant?.id} />, {
        wrapper: ShopifyTestProviders,
      });

      expect(
        screen.getByText(variant?.priceV2?.amount || '', {exact: false})
      ).toBeInTheDocument();
    });

    it("renders <Money /> with the variant's minimum compareAt price", () => {
      const product = getProduct();
      const variant = product?.variants?.nodes?.[0];
      render(
        <ProductPrice
          data={product}
          priceType="compareAt"
          variantId={variant?.id}
        />,
        {
          wrapper: ShopifyTestProviders,
        }
      );

      expect(
        screen.getByText(variant?.compareAtPriceV2?.amount || '', {
          exact: false,
        })
      ).toBeInTheDocument();
    });

    it('renders <Money /> with unit prices when valueType is `unit`', () => {
      const product = getProduct();
      const variant = product?.variants?.nodes?.[0];
      render(
        <ProductPrice
          data={product}
          valueType="unit"
          variantId={variant?.id}
        />,
        {
          wrapper: ShopifyTestProviders,
        }
      );

      expect(
        screen.getByText(variant?.unitPrice?.amount || '', {exact: false})
      ).toBeInTheDocument();
    });
  });

  it("renders <Money /> with the product's minimum regular price by default", () => {
    const product = getProduct();
    render(<ProductPrice data={product} />, {
      wrapper: ShopifyTestProviders,
    });

    expect(
      screen.getByText(product.priceRange?.minVariantPrice?.amount || '', {
        exact: false,
      })
    ).toBeInTheDocument();
  });

  it("renders <Money /> with the product's maximum regular price when `valueType` is `max`", () => {
    const product = getProduct();
    render(<ProductPrice data={product} valueType="max" />, {
      wrapper: ShopifyTestProviders,
    });

    expect(
      screen.getByText(product.priceRange?.maxVariantPrice?.amount || '', {
        exact: false,
      })
    ).toBeInTheDocument();
  });

  it("renders <Money /> with the product's minimum compareAt price when the `priceType` is `compareAt`", () => {
    const product = getProduct();
    render(<ProductPrice data={product} priceType="compareAt" />, {
      wrapper: ShopifyTestProviders,
    });

    expect(
      screen.getByText(
        product.compareAtPriceRange?.minVariantPrice?.amount || '',
        {exact: false}
      )
    ).toBeInTheDocument();
  });

  it("renders <Money /> with the product's maximum compareAt price when `valueType` is `max` and `priceType` is `compareAt`", () => {
    const product = getProduct();
    render(
      <ProductPrice data={product} valueType="max" priceType="compareAt" />,
      {
        wrapper: ShopifyTestProviders,
      }
    );

    expect(
      screen.getByText(
        product.compareAtPriceRange?.maxVariantPrice?.amount || '',
        {exact: false}
      )
    ).toBeInTheDocument();
  });

  it('supports passthrough props', () => {
    const product = getProduct();
    render(<ProductPrice data={product} className="emphasized" />, {
      wrapper: ShopifyTestProviders,
    });

    expect(
      screen.getByText(product.priceRange?.minVariantPrice?.amount || '', {
        exact: false,
      })
    ).toHaveClass('emphasized');
  });
});
