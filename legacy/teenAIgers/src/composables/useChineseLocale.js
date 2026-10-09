import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export function useChineseLocale() {
        const { locale } = useI18n();

        const isChineseLocale = computed(() => {
                return locale.value === 'zh-Hans' ||
                        locale.value === 'zh-Hant' ||
                        locale.value.startsWith('zh');
        });

        return {
                isChineseLocale
        };
}
