import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

import en from './locale/en';
import am from './locale/am';
import ru from './locale/ru';

i18n
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: false,
        fallbackLng: 'am', // Default fallback language
        lng: 'am',
        interpolation: {
            escapeValue: false, // React already escapes values
        },
        resources: {
            en: {translation: en}, // Static translation files for fallback
            am: {translation: am},
            ru: {translation: ru}
        },
        cache: {
            enabled: true,
            prefix: 'i18next_res_',
            expirationTime: 7 * 24 * 60 * 60 * 1000 // Cache translations for a week
        },
        backend: {
            
            loadPath: '/locales/{{lng}}.json', // Set the path for backend translations
        }
    });

export default i18n;
