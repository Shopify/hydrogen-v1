import {createContext} from 'react';
import type {ProductOptionsHookValue} from '../../hooks';

export const ProductOptionsContext =
  createContext<ProductOptionsHookValue | null>(null);
