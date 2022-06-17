import {createContext} from 'react';
export interface LocalizationContextValue {
  country: {
    isoCode: string;
  };
  language: {
    isoCode: string;
  };
}

export const LocalizationContext =
  createContext<LocalizationContextValue | null>(null);
