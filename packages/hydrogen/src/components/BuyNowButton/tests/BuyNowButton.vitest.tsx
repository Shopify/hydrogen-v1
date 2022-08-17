import React from 'react';
import {ShopifyTestProviders} from '../../../utilities/tests/provider-helpers.js';
import {render, screen} from '@testing-library/react';
import {vi} from 'vitest';
import userEvent from '@testing-library/user-event';

const mockCreateInstantCheckout = vi.fn();
const mockUseInstantCheckout = vi.fn();
const mockUseCartFetch = vi.fn();

import {BuyNowButton} from '../BuyNowButton.client.js';

vi.mock('../../CartProvider/index.js', () => ({
  ...(vi.importActual('../../CartProvider/index.js') as {}),
  useInstantCheckout: mockUseInstantCheckout,
  useCartFetch: mockUseCartFetch,
}));

describe('<BuyNowButton/>', () => {
  beforeEach(() => {
    mockUseInstantCheckout.mockReturnValue({
      createInstantCheckout: mockCreateInstantCheckout,
      checkoutUrl: undefined,
    });
  });

  it('renders a button', () => {
    render(<BuyNowButton variantId="1">Buy now</BuyNowButton>, {
      wrapper: ShopifyTestProviders,
    });
    expect(screen.getByRole('button')).toHaveTextContent('Buy now');
  });

  it('can optionally disable the button', () => {
    render(
      <BuyNowButton disabled={true} variantId="1">
        Buy now
      </BuyNowButton>,
      {
        wrapper: ShopifyTestProviders,
      }
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('allows pass-through props', () => {
    render(
      <BuyNowButton className="fancy-button" variantId="1">
        Buy now
      </BuyNowButton>,
      {
        wrapper: ShopifyTestProviders,
      }
    );

    expect(screen.getByRole('button')).toHaveClass('fancy-button');
  });

  describe('when the button is clicked', () => {
    it('uses useCartCreateCallback with the correct arguments', async () => {
      const user = userEvent.setup();

      render(
        <BuyNowButton
          attributes={[
            {key: 'color', value: 'blue'},
            {key: 'size', value: 'large'},
          ]}
          quantity={4}
          variantId="SKU123"
        >
          Buy now
        </BuyNowButton>,
        {
          wrapper: ShopifyTestProviders,
        }
      );

      await user.click(screen.getByRole('button'));

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

    it('disables the button', async () => {
      const user = userEvent.setup();

      render(<BuyNowButton variantId="1">Buy now</BuyNowButton>, {
        wrapper: ShopifyTestProviders,
      });

      const button = screen.getByRole('button');

      expect(button).not.toBeDisabled();

      await user.click(button);

      expect(button).toBeDisabled();
    });
  });

  describe('when a checkout URL is available', () => {
    const {location} = window;
    const mockSetHref = vi.fn((href) => href);

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
      render(<BuyNowButton variantId="1">Buy now</BuyNowButton>, {
        wrapper: ShopifyTestProviders,
      });

      expect(mockSetHref).toHaveBeenCalledTimes(1);
      expect(mockSetHref).toHaveBeenCalledWith('/checkout?id=123');
    });
  });
});
