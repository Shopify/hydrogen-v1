import {CountryCode, LanguageCode} from '../storefront-api-types';

/**
 * Calculates locale based on provided language and countryCode
 * 1. If language is extended with region, hyphenate and use as locale
 * 2. Else merge language and countryCode
 */
export function getLocale(
  language: `${LanguageCode}`,
  countryCode: `${CountryCode}`
) {
  if (isLanguageExtended(language)) {
    return hyphenateLanguage(language);
  }
  return `${language}-${countryCode}`;
}

function hyphenateLanguage(str: `${LanguageCode}`) {
  return str.replace('_', '-');
}

function isLanguageExtended(str?: `${LanguageCode}`) {
  if (!str) return false;
  return /-|_/.test(str);
}
