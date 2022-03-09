import {createContext} from 'react';
import {LocalizationQuery} from './LocalizationQuery';

export type Localization = LocalizationQuery['localization'];

export interface LocalizationContextValue {
  country?: Localization['country'];
  availableCountries: Localization['availableCountries'];
  setCountry(country: Localization['country']): void;
}

// TODO: Two versions of context are loading again, since Vite is appending a `?t`
// query param to some, and not to others.
export const LocalizationContext = (globalThis.localizationContext ||=
  createContext<LocalizationContextValue | null>(null));
