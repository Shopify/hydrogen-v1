import {createContext} from 'react';
import {ShopifyProviderValue} from './types';

export const ShopifyContext = createContext<ShopifyProviderValue | null>(null);
