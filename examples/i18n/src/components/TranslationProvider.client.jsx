import React, {useState, useEffect, useRef} from 'react';
import {useLocalization} from '@shopify/hydrogen';
import {I18nextProvider} from 'react-i18next';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';

// Bundle the default translation
import en from '../assets/locales/en/translation.json';

i18n
  // load other translations dynamically
  .use(
    resourcesToBackend((language, namespace, callback) => {
      import(`../assets/locales/${language}/${namespace}.json`)
        .then((resources) => {
          callback(null, resources);
        })
        .catch((error) => {
          callback(error, null);
        });
    })
  )
  .use(LanguageDetector)
  .use(initReactI18next);

export function TranslationProvider({children}) {
  const {language} = useLocalization();
  const init = useRef(false);
  const [i18nInstance, setI18nInstance] = useState(null);

  useEffect(() => {
    if (init.current) return;

    init.current = true;
    const cachedLang = localStorage.getItem('i18nextLng');
    const defaultLang = language.isoCode.toLowerCase();

    if (!cachedLang) {
      localStorage.setItem('i18nextLng', defaultLang);
    }
    // initialize i18next
    i18n.init(
      {
        partialBundledLanguages: true, // This allows some resources to be set on init while others after
        fallbackLng: defaultLang,
        debug: false,
        react: {useSuspense: true},
        ns: ['translation'],
        defaultNS: 'translation',
        interpolation: {
          escapeValue: false,
        },
        resources: {
          en: {translation: en},
        },
      },
      () => {
        setI18nInstance(i18n);
      }
    );
  }, [i18n, setI18nInstance, i18nInstance, language]);

  return (
    i18nInstance && (
      <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
    )
  );
}
