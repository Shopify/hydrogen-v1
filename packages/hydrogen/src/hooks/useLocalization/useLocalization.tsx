import {LocalizationContext} from '../../foundation/ShopifyProvider/ShopifyProvider.client';
import type {
  Locale,
  LocalizationContextValue,
} from '../../foundation/ShopifyProvider/types';
import {useEnvContext} from '../../foundation/ssr-interop';

export function useLocalization(): LocalizationContextValue & {
  locale: Locale;
} {
  const localization = useEnvContext(
    (req) => req.ctx.localization,
    LocalizationContext
  );

  if (localization == null) {
    throw new Error('No Localization Context available');
  }

  return localization;
}
