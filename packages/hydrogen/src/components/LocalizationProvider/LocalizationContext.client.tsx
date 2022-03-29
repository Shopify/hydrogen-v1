import {createContext} from 'react';
import {LocalizationQuery} from './LocalizationQuery';

export type Localization = LocalizationQuery['localization'];

export interface LocalizationContextValue {
  country?: Localization['country'];
  setCountry(country: Localization['country']): void;
}

export const LocalizationContext =
  createContext<LocalizationContextValue | null>(null);
