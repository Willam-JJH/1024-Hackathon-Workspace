import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Cookies from 'js-cookie';

import enTranslation from './en.json';
import zhTranslation from './zh.json';

// doesnt work i think
const storedLang = Cookies.get('i18next');

const systemLang = typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : null;
const defaultLng = storedLang || (systemLang === 'zh' ? 'zh' : 'en');

i18n
        .use(initReactI18next)
        .init({
                resources: {
                        en: {
                                translation: enTranslation
                        },
                        zh: {
                                translation: zhTranslation
                        }
                },
                lng: defaultLng,
                fallbackLng: 'en',
                interpolation: {
                        escapeValue: false
                }
        });

export default i18n;
