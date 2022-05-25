import React from 'react';

import {mountWithProviders} from '../../../utilities/tests/shopifyMount';

const mockCreateInstantCheckout = jest.fn();
const mockUseInstantCheckout = jest.fn();
const mockUseCartFetch = jest.fn();

import {BuyNowButton} from '../BuyNowButton.client';

jest.mock('../../CartProvider', () => ({
  ...(jest.requireActual('../../CartProvider') as {}),
  useInstantCheckout: mockUseInstantCheckout,
  useCartFetch: mockUseCartFetch,
}));

describe('BuyNowButton', () => {
  beforeEach(() => {
    mockUseInstantCheckout.mockReturnValue({
      createInstantCheckout: mockCreateInstantCheckout,
      checkoutUrl: undefined,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a button', () => {
    const component = mountWithProviders(
      <BuyNowButton variantId="1">Buy now</BuyNowButton>
    );
    expect(component).toContainReactComponent('button', {
      children: 'Buy now',
    });
  });

  it('can optionally disable the button', () => {
    const component = mountWithProviders(
      <BuyNowButton disabled={true} variantId="1">
        Buy now
      </BuyNowButton>
    );

    expect(component).toContainReactComponent('button', {
      disabled: true,
    });
  });

  it('allows pass-through props', () => {
    const component = mountWithProviders(
      <BuyNowButton className="fancy-button" variantId="1">
        Buy now
      </BuyNowButton>
    );

    expect(component).toContainReactComponent('button', {
      className: 'fancy-button',
    });
  });

  describe('when the button is clicked', () => {
    it('uses useCartCreateCallback with the correct arguments', () => {
      const component = mountWithProviders(
        <BuyNowButton
          attributes={[
            {key: 'color', value: 'blue'},
            {key: 'size', value: 'large'},
          ]}
          quantity={4}
          variantId="SKU123"
        >
          Buy now
        </BuyNowButton>
      );

      component.act(() => {
        component.find('button')?.trigger('onClick');
      });

      expect(mockCreateInstantCheckout).toHaveBeenCalledTimes(1);
      expect(mockCreateInstantCheckout).toHaveBeenCalledWith({
        lines: [
          {
            quantity: 4,
            merchandiseId: 'SKU123',
            attributes: [
              {key: 'color', value: 'blue'},
              {key: 'size', value: 'large'},
            ],
          },
        ],
      });
    });

    it('disables the button', () => {
      const component = mountWithProviders(
        <BuyNowButton variantId="1">Buy now</BuyNowButton>
      );

      expect(component).toContainReactComponent('button', {
        disabled: false,
      });

      component.act(() => {
        component.find('button')?.trigger('onClick');
      });

      expect(component.find('button')).toHaveReactProps({disabled: true});
    });
  });

  describe('when a checkout URL is available', () => {
    const {location} = window;
    const mockSetHref = jest.fn((href) => href);

    beforeEach(() => {
      mockUseInstantCheckout.mockReturnValue({
        createInstantCheckout: mockCreateInstantCheckout,
        checkoutUrl: '/checkout?id=123',
      });

      delete (window as Partial<Window>).location;
      window.location = {...window.location};
      Object.defineProperty(window.location, 'href', {
        set: mockSetHref,
      });
    });

    afterEach(() => {
      window.location = location;
      mockUseInstantCheckout.mockRestore();
    });

    it('redirects to checkout', () => {
      mountWithProviders(<BuyNowButton variantId="1">Buy now</BuyNowButton>);

      expect(mockSetHref).toHaveBeenCalledTimes(1);
      expect(mockSetHref).toHaveBeenCalledWith('/checkout?id=123');
    });
  });

  describe('given an on click event handler', () => {
    it('calls the on click event handler', () => {
      const mockOnClick = jest.fn();
      const component = mountWithProviders(
        <BuyNowButton onClick={mockOnClick} variantId="1">
          Buy now
        </BuyNowButton>
      );

      component.find('button')?.trigger('onClick');

      expect(mockOnClick).toBeCalled();
    });

    it('calls the default behaviour of create instant checkout', () => {
      const mockOnClick = jest.fn();
      const component = mountWithProviders(
        <BuyNowButton onClick={mockOnClick} variantId="1">
          Buy now
        </BuyNowButton>
      );

      component.find('button')?.trigger('onClick');

      expect(mockCreateInstantCheckout).toBeCalled();
    });

    describe('and event preventDefault is called', () => {
      it('calls the on click event handler without calling the default behaviour of creating instant checkout', () => {
        const mockOnClick = jest.fn((event) => {
          event.preventDefault();
        });
        const component = mountWithProviders(
          <BuyNowButton onClick={mockOnClick} variantId="1">
            Buy now
          </BuyNowButton>
        );

        component
          .find('button')
          ?.trigger('onClick', new MouseEvent('click', {cancelable: true}));

        expect(mockOnClick).toBeCalled();
        expect(mockCreateInstantCheckout).not.toBeCalled();
      });
    });

    describe('and the on click handler returns false', () => {
      it('calls the on click event handler without calling the default behaviour of add lines', () => {
        const mockOnClick = jest.fn(() => false);
        const component = mountWithProviders(
          <BuyNowButton onClick={mockOnClick} variantId="1">
            Buy now
          </BuyNowButton>
        );

        component.find('button')?.trigger('onClick');

        expect(mockOnClick).toBeCalled();
        expect(mockCreateInstantCheckout).not.toBeCalled();
      });
    });
  });
});
