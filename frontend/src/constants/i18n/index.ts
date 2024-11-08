import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './en/translation.json';
import ruTranslation from './ru/translation.json';

i18n.use(LanguageDetector) // Автоматическое определение языка
    .use(initReactI18next) // Подключение i18next к React
    .init({
        resources: {
            en: { translation: enTranslation },
            ru: { translation: ruTranslation },
        },
        fallbackLng: 'ru', // Язык по умолчанию, если нужный перевод не найден
        interpolation: {
            escapeValue: false, // React уже экранирует значения
        },
    });

export default i18n;
