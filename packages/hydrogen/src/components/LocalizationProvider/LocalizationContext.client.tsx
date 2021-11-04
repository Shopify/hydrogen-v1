import {createContext} from 'react';
import {LocalizationQuery} from './LocalizationQuery';

export type Localization = LocalizationQuery['localization'];

export interface LocalizationContextValue {
  country?: Localization['country'];
  availableCountries: Localization['availableCountries'];
  setCountry(country: Localization['country']): void;
}

/**
 * This is a workaround to support exposing context from within a server component
 * exported from Hydrogen.
 */
declare global {
  var __localizationContext: any;
}

export const LocalizationContext =
  globalThis.__localizationContext ||
  createContext<LocalizationContextValue | null>(null);

globalThis.__localizationContext = LocalizationContext;
