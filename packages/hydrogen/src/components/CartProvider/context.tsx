import {createContext} from 'react';
import {CartWithActions} from './types';

export const CartContext = createContext<CartWithActions | null>(null);
