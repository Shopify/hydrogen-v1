import {createContext} from 'react';
import {ProductOptionsHookValue} from '../../hooks';
import type {Product} from '../../graphql/types/types';

export const ProductContext = createContext<ProductContextType | null>(null);

export type ProductContextType = Partial<Product>;

export const ProductOptionsContext =
  createContext<ProductOptionsHookValue | null>(null);
