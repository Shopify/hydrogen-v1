/**
 * returns `ltr` or `rtl` based on the locale
 */
export const getLocaleDirection = (locale?: string): 'ltr' | 'rtl' => {
  if (!locale) return 'ltr';

  const lng = locale.split('-')[0];
  const rtlLanguages = new Set(['ar', 'he', 'fa', 'ps', 'ur', 'yi']);

  return rtlLanguages.has(lng) ? 'rtl' : 'ltr';
};

/**
 * returns language code from locale
 */
export const getLocaleLanguage = (locale?: string): string => {
  if (!locale) return 'en';

  return locale.split('-')[0];
};
