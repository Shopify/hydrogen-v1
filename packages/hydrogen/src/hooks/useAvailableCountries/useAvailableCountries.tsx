import {useContext} from 'react';
import {
  LocalizationContext,
  LocalizationContextValue,
} from '../../components/LocalizationProvider/LocalizationContext.client';

function useLocalization() {
  const context = useContext<LocalizationContextValue>(LocalizationContext);

  if (context == null) {
    throw new Error('No Localization Context available');
  }

  return context;
}

/**
 * The `useAvailableCountries` hook returns an array of available countries used for localization.
 * It must be a descendent of a `LocalizationProvider` component.
 */
export function useAvailableCountries() {
  const context = useLocalization();

  return context.availableCountries;
}
