import { useContext } from 'react';
import { CartLineContext } from '../../components/CartLineProvider/context';
/**
 * The `useCartLine` hook provides access to the cart line object. It must be a descendent of a `CartProvider` component.
 */
export function useCartLine() {
    const context = useContext(CartLineContext);
    if (context == null) {
        throw new Error('Expected a cart line context but none was found');
    }
    return context;
}
