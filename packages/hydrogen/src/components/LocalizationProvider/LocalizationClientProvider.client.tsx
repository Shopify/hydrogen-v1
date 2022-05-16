import React, {ReactNode} from 'react';
import {LocalizationContext, Localization} from './LocalizationContext.client';

export default function LocalizationClientProvider({
  localization,
  children,
}: {
  children: ReactNode;
  localization: Localization;
}) {
  return (
    <LocalizationContext.Provider value={localization}>
      {children}
    </LocalizationContext.Provider>
  );
}
