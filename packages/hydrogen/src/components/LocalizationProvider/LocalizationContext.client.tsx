import {createContext} from 'react';
import type {LocalizationQuery} from './LocalizationProvider.server';

export type Localization = LocalizationQuery['localization'];

export interface LocalizationContextValue {
  country?: Localization['country'];
}

export const LocalizationContext =
  createContext<LocalizationContextValue | null>(null);
