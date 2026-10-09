import { getCurrentInstance, ref, watch } from 'vue'

export const useLanguage = () => {
  const app = getCurrentInstance()
  const currentLanguage = ref(uni.getLocale() || 'en')

  const availableLanguages = {
    'en': 'en', //idk
    'zh-Hans': 'zh-Hans',
    'zh-Hant': 'zh-Hant'
  }

  const setLanguage = (lang) => {
    if (availableLanguages.hasOwnProperty(lang)) {
      currentLanguage.value = lang
      uni.setLocale(lang)
      if (app?.proxy?.$i18n) {
        app.proxy.$i18n.locale = lang
      }
    }
  }

  // init on mount
  setLanguage(currentLanguage.value)

  return {
    //returning ref now, not value, get need .value in vue
    currentLanguage, //: currentLanguage.value,
    availableLanguages,
    setLanguage
  }
}



// examplar code

// <script>
// export default {
//   data() {
//     return {
//       systemLocale: '',
//       applicationLocale: '',
//       currentLanguage: 'en'
//     }
//   },
//   onLoad() {
//     let systemInfo = uni.getSystemInfoSync();
//     this.systemLocale = systemInfo.language;
//     this.applicationLocale = uni.getLocale();
//     this.isAndroid = systemInfo.platform.toLowerCase() === 'android';
//     this.currentLanguage = ref(this.applicationLocale || 'en');
//     uni.onLocaleChange((e) => {
//       this.applicationLocale = e; //e.locale
//     })
//   },
//   methods: {
//     onLocaleChange(e) {
//       if (this.isAndroid) {
//         uni.showModal({
//           content: this.$t('index.language-change-confirm'),
//           success: (res) => {
//             if (res.confirm) {
//               uni.setLocale(e);
//             }
//           }
//         })
//       } else {
//         uni.setLocale(e);
//         this.$i18n.locale = e;
//       }
//     }
//   }
// }
// </script>
