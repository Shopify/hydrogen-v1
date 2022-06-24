import {LocalizationContext} from '../../foundation/ShopifyProvider/ShopifyProvider.client';
import type {LocalizationContextValue} from '../../foundation/ShopifyProvider/types';
import {useEnvContext} from '../../foundation/ssr-interop';
import {CountryCode, LanguageCode} from '../../storefront-api-types';

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
