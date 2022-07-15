import React, {ReactNode} from 'react';
import {LocalizationContext} from '../../foundation/ShopifyProvider/ShopifyProvider.client.js';
import type {LocalizationContextValue} from '../../foundation/ShopifyProvider/types.js';

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
