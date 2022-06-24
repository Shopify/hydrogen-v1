import React, {ReactNode} from 'react';
import {LocalizationContext} from '../../foundation/ShopifyProvider/ShopifyProvider.client';
import type {LocalizationContextValue} from '../../foundation/ShopifyProvider/types';

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
