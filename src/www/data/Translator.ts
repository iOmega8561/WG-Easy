import en from '../locale/en.json';
import it from '../locale/it.json';
import ru from '../locale/ru.json';

import { initReactI18next } from 'react-i18next';

import Translator from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

Translator
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

export default Translator;
export const translate = Translator.t;