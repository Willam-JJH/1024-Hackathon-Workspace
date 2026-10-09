import { ref, computed, getCurrentInstance, Ref, ComputedRef } from 'vue'

interface LanguageComposable {
        currentLanguage: Ref<string>
        isChineseLocale: ComputedRef<boolean>
        availableLanguages: Record<string, string>
        setLanguage: (lang: string) => void
}

export function useChineseLocale(): LanguageComposable {
        const app = getCurrentInstance()
        const currentLanguage = ref(uni.getLocale() || 'en')

        const availableLanguages = {
                'en': 'en',
                'zh-Hans': 'zh-Hans',
                'zh-Hant': 'zh-Hant'
        }

        const isChineseLocale = computed(() => {
                return currentLanguage.value.startsWith('zh')
        })

        const setLanguage = (lang: string) => {
                if (availableLanguages.hasOwnProperty(lang)) {
                        currentLanguage.value = lang
                        uni.setLocale(lang)
                        if (app?.proxy?.$i18n) {
                                app.proxy.$i18n.locale = lang
                        }

                        applyLanguageChange(lang)
                        //       const systemInfo = uni.getSystemInfoSync()
                        //       if (systemInfo.platform.toLowerCase() === 'android') {
                        //         uni.showModal({
                        //           content: app?.proxy?.$t('index.language-change-confirm'),
                        //           success: (res) => {
                        //             if (res.confirm) {
                        //               applyLanguageChange(lang)
                        //             }
                        //           }
                        //         })
                        //       } else {
                        //         applyLanguageChange(lang)
                        //       }
                }
        }

        const applyLanguageChange = (lang: string) => {
                uni.setLocale(lang)
                if (app?.proxy?.$i18n) {
                        app.proxy.$i18n.locale = lang
                }
        }

        uni.onLocaleChange((e: any) => {
                setLanguage(e.locale || e)
        })

        // init
        setLanguage(currentLanguage.value)

        return {
                currentLanguage,
                isChineseLocale,
                availableLanguages,
                setLanguage
        }
}
