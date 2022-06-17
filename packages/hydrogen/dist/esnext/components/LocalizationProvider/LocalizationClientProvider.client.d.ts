import { ReactNode } from 'react';
import { Localization } from './LocalizationContext.client';
export default function LocalizationClientProvider({ localization, children, }: {
    children: ReactNode;
    localization: Localization;
}): JSX.Element;
