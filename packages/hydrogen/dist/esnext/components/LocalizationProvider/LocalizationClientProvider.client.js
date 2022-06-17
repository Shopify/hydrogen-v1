import React from 'react';
import { LocalizationContext } from './LocalizationContext.client';
export default function LocalizationClientProvider({ localization, children, }) {
    return (React.createElement(LocalizationContext.Provider, { value: localization }, children));
}
