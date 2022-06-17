import { useContext } from 'react';
import { LocalizationContext } from '../../components/LocalizationProvider/LocalizationContext.client';
function useLocalization() {
    const context = useContext(LocalizationContext);
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
    return [context.country];
}
