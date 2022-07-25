import {LocalizationContext} from '../../foundation/ShopifyProvider/ShopifyProvider.client.js';
import type {
  Locale,
  LocalizationContextValue,
} from '../../foundation/ShopifyProvider/types.js';
import {useEnvContext} from '../../foundation/ssr-interop.js';

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
