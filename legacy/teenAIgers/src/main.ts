import { createSSRApp } from "vue";
import App from "./App.vue";


import en from './locales/en.json'
import zhHans from './locales/zh-Hans.json'
import zhHant from './locales/zh-Hant.json'
const messages = {
  en,
  'zh-Hans': zhHans,
  'zh-Hant': zhHant
}



let i18nConfig = {
  locale: uni.getLocale(),// 获取已设置的语言
  messages
}
import { createI18n } from 'vue-i18n'
const i18n = createI18n(i18nConfig)

export function createApp() {
  const app = createSSRApp(App);
  app.use(i18n)
  return {
    app,
  };
}