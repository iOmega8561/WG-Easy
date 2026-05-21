import en from './locales/en.json';
import it from './locales/it.json';
import ru from './locales/ru.json';

import { initReactI18next } from 'react-i18next';

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'it', 'ru'],
    resources: {
      en: { translation: en, },
      it: { translation: it, },
      ru: { translation: ru, }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18next.t;