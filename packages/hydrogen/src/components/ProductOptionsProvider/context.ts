import {createContext} from 'react';
import {ProductOptionsHookValue} from '../../hooks';

export const ProductOptionsContext =
  createContext<ProductOptionsHookValue | null>(null);
