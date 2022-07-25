import {createContext} from 'react';
import {CartWithActions} from './types.js';

export const CartContext = createContext<CartWithActions | null>(null);
