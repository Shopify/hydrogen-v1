import {createRef} from 'react';

import {mountWithProviders} from '../../../utilities/tests/shopifyMount.js';
import {BaseButton} from '../../BaseButton/index.js';

const mockCreateInstantCheckout = jest.fn();
const mockUseInstantCheckout = jest.fn();
const mockUseCartFetch = jest.fn();

import {BuyNowButton} from '../BuyNowButton.client.js';

jest.mock('../../CartProvider/index.js', () => ({
  ...(jest.requireActual('../../CartProvider/index.js') as {}),
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

  describe('BaseButton', () => {
    it('passes the onClick handler', () => {
      const mockOnClick = jest.fn();

      const component = mountWithProviders(
        <BuyNowButton variantId="1" onClick={mockOnClick}>
          Buy now
        </BuyNowButton>
      );

      expect(component).toContainReactComponent(BaseButton, {
        onClick: mockOnClick,
      });
    });

    it('passes the buttonRef', () => {
      const mockRef = createRef<HTMLButtonElement>();

      const component = mountWithProviders(
        <BuyNowButton variantId="1" buttonRef={mockRef}>
          Buy now
        </BuyNowButton>
      );

      expect(component).toContainReactComponent(BaseButton, {
        buttonRef: mockRef,
      });
    });
  });
});
