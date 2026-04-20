import en from '../locale/en.json';
import it from '../locale/it.json';
import ru from '../locale/ru.json';

import Translator from 'i18next';
import { initReactI18next } from 'react-i18next';

Translator
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en, },
      it: { translation: it, },
      ru: { translation: ru, }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default Translator;
export const translate = Translator.t;