import React from 'react';
import {ShopifyTestProviders} from '../../../utilities/tests/provider-helpers.js';
import {render, screen} from '@testing-library/react';
import {BaseButton} from '../BaseButton.client.js';
import {vi} from 'vitest';
import userEvent from '@testing-library/user-event';

describe('<BaseButton/>', () => {
  it('renders a button', () => {
    render(<BaseButton>Base Button</BaseButton>, {
      wrapper: ShopifyTestProviders,
    });

    expect(screen.getByRole('button')).toHaveTextContent('Base Button');
  });

  it('allows passthrough props', () => {
    render(<BaseButton className="bg-blue-600">Base Button</BaseButton>, {
      wrapper: ShopifyTestProviders,
    });

    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');
  });

  describe('given an on click event handler', () => {
    it('calls the on click event handler', async () => {
      const mockOnClick = vi.fn();
      const user = userEvent.setup();

      render(<BaseButton onClick={mockOnClick}>Base Button</BaseButton>, {
        wrapper: ShopifyTestProviders,
      });

      await user.click(screen.getByRole('button'));

      expect(mockOnClick).toBeCalled();
    });

    it('calls the given default on click behaviour', async () => {
      const mockDefaultOnClick = vi.fn();
      const user = userEvent.setup();

      render(
        <BaseButton onClick={() => {}} defaultOnClick={mockDefaultOnClick}>
          Base Button
        </BaseButton>,
        {
          wrapper: ShopifyTestProviders,
        }
      );

      await user.click(screen.getByRole('button'));

      expect(mockDefaultOnClick).toBeCalled();
    });

    describe('and event preventDefault is called', () => {
      it('calls the on click event handler without calling the default on click behaviour', async () => {
        const mockOnClick = vi.fn((event) => {
          event.preventDefault();
        });
        const mockDefaultOnClick = vi.fn();
        const user = userEvent.setup();

        render(
          <BaseButton onClick={mockOnClick} defaultOnClick={mockDefaultOnClick}>
            Base Button
          </BaseButton>,
          {
            wrapper: ShopifyTestProviders,
          }
        );

        await user.click(screen.getByRole('button'));

        expect(mockOnClick).toBeCalled();
        expect(mockDefaultOnClick).not.toBeCalled();
      });
    });

    describe('and the on click handler returns false', () => {
      it('calls the on click event handler without calling the default on click behaviour', async () => {
        const mockOnClick = vi.fn(() => false);
        const mockDefaultOnClick = vi.fn();
        const user = userEvent.setup();

        render(
          <BaseButton onClick={mockOnClick} defaultOnClick={mockDefaultOnClick}>
            Base Button
          </BaseButton>,
          {
            wrapper: ShopifyTestProviders,
          }
        );

        await user.click(screen.getByRole('button'));

        expect(mockOnClick).toBeCalled();
        expect(mockDefaultOnClick).not.toBeCalled();
      });
    });
  });
});
