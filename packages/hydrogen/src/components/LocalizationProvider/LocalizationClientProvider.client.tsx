import React, {ReactNode} from 'react';
import {
  LocalizationContext,
  LocalizationContextValue,
} from './LocalizationContext.client';

export default function LocalizationClientProvider({
  localization,
  children,
}: {
  children: ReactNode;
  localization: LocalizationContextValue;
}) {
  return (
    <LocalizationContext.Provider value={localization}>
      {children}
    </LocalizationContext.Provider>
  );
}
