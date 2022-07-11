import {LocalizationContext} from '../../foundation/ShopifyProvider/ShopifyProvider.client.js';
import type {LocalizationContextValue} from '../../foundation/ShopifyProvider/types.js';
import {useEnvContext} from '../../foundation/ssr-interop.js';
import {CountryCode, LanguageCode} from '../../storefront-api-types.js';

export function useLocalization(): LocalizationContextValue & {
  locale: `${LanguageCode}-${CountryCode}`;
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
