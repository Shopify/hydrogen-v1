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
 * The `useCountry` hook returns a tuple of the current localization country and a function for updating it.
 * It must be a descendent of a `LocalizationProvider` component.
 */
export function useCountry() {
  const context = useLocalization();

  return [context.country, context.setCountry];
}
