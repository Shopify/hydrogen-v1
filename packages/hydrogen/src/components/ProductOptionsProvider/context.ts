import {createContext} from 'react';
import type {ProductOptionsHookValue} from '../../hooks/index.js';

export const ProductOptionsContext =
  createContext<ProductOptionsHookValue | null>(null);
