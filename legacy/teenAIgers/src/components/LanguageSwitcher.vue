<template>
  <view class="language-switch active:border-1 ease-in-out transition border-primary rounded-md">
    <button @click="handleLanguageChange" class="lang-btn chinese">  
    <!-- :class="{chinese: currentLanguage.value === 'zh-Hans'}"> -->
      <!-- {{ currentLanguage.value === 'en' ? '中文' : 'English' }} -->
      {{ $t('languageSwitch') }} 
      <!-- the one ontop broke, not updating correctly so use this -->
    </button>
  </view>
</template>

<script setup>
import { useLanguage } from '@/composables/useLanguage';

const { currentLanguage, setLanguage } = useLanguage();

const handleLanguageChange = () => {
  const newLang = currentLanguage.value === 'zh-Hans' ? 'en' : 'zh-Hans';
  
  setLanguage(newLang);
  //currentlanguge value set in the js composable
};
</script>

<style lang="scss" scoped>
.chinese{
  font-family: 'unifont jp' !important;
}


//fix later, add from ui design stuff
.language-switch {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
}

.lang-btn {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 2px solid var(--primary);
  padding: 8px 16px;
  border-radius: 4px;
  font-family: var(--text-font);
  cursor: pointer;
  transition: all 0.3s ease;
}

.lang-btn:hover {
  background: var(--primary);
  color: black;
}
</style>
