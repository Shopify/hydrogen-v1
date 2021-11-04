import {createContext} from 'react';
import {Cart} from '../CartProvider';

export const CartLineContext = createContext<Cart['lines'][1] | null>(null);
