<template>
  <view class="layout" :class="{ 'chinese-locale': isChineseLocale }">
    <byterain/>
    <LanguageSwitcher/>

    <view class="topbar"></view>
    <view class="content">
      <slogan/>
      <br>
      <br>

      <view class="info-area pb-0">
        <view ref="text1" class="text-left info">
          <p class="inline">
            {{ $t('intro.text1') }}
            <span class="accent">{{ $t('intro.accent1') }}</span>
            {{ $t('intro.text2') }}
          </p>
        </view>
        <view class="flex flex-row w-full">
          <view ref="text2" class="text-left info w-5/6">
            <text class="" style="align-items: normal">
              {{ $t('section2.text1') }}<br/>
              {{ $t('section2.text2') }}<br/>
              {{ $t('section2.text3') }}
              <br/><br/>
              {{ $t('section2.text4') }}
              <text class="accent">{{ $t('section2.accent') }}</text>
            </text>
          </view>
          <view class="flex w-1/6">
            <!-- 给 img 元素添加 ref -->
            <img ref="img1" class="relative scale-[4.75] bottom-15 left-5" src="@/static/icon/pointer1.svg"/>
          </view>
        </view>

        <!--  :class="{ 'chinese': currentLanguage === 'zh' } -->
        <text ref="text3" class="info text-right"> 
          {{ $t('section1.text') }}
        </text>

        <view class="flex flex-row w-full text-right justify-items-end items-end mt-10">
          <view class="flex w-1/6 z-[100] relative scale-75 right-7 bottom-17">
            <img ref="img2" class="relative scale-[4.75] bottom-15 left-5" src="@/static/icon/pointer2.svg"/>
          </view>
          <text ref="text4_tp" class="info text-[1.1rem] w-5/6 scale-100 ml-3">
            <TypeWriterEffect class="">
              <view class="inline">
                {{ $t('theme.line1') }}<br/>
                <text class="accent">{{ $t('theme.line2') }}</text>
                <br/>
                <text class="text-[0.75rem] text-right ml-30">{{ $t('theme.subtitle') }}</text>
              </view>
            </TypeWriterEffect>
          </text>
        </view>
        <text ref="text5" class="info text-left font-bold">
          {{ $t('section3.text1') }}<br/>
          {{ $t('section3.text2') }}
          <text class="accent">{{ $t('section3.accent1') }}</text>
          {{ $t('section3.text3') }}
          <text class="accent">{{ $t('section3.accent2') }}</text>
        </text>
        <text ref="text6" class="info text-left">
          {{ $t('section4.text1') }}
          <text class="accent">{{ $t('section4.accent') }}</text>
          {{ $t('section4.text2') }}
          <br/><br/>
          {{ $t('section4.text3') }}
          <text class="accent">{{ $t('section4.accent2') }}</text>
        </text>
        <view class="flex flex-row w-full info text-left">
          <text ref="text7" class="w-[75%] text-black z-[100]">
            {{ $t('section5.text1') }}
            <text class="accent">{{ $t('section5.accent') }}</text>
          </text>
          <view class="flex w-[25%] z-[1000] relative scale-55 left-7 top-25 ">
            <!-- 给 img 元素添加 ref -->
            <img ref="img3" class="relative scale-[4.75] bottom-15 left-5" src="@/static/icon/pointer3.svg"/>
          </view>
        </view>
        <TypeWriterEffect ref="text8_tp" class="info mt-8 text-black font-800 p-0 w-full title-font">
          <text>
            {{ $t('section6.text1') }}
            <br/>
            <text class="accent font-800 p-0 w-full title-font">
              {{ $t('section6.accent') }}
            </text>
          </text>
        </TypeWriterEffect>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import gsap from 'gsap'
import CSSPlugin from 'gsap/CSSPlugin'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Byterain from "@/components/byterain.vue";
import Slogan from "@/components/slogan.vue";
import TypeWriterEffect from "@/components/TypeWriterEffect.vue";

import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import { useChineseLocale } from '@/composables/useChineseLocale';
const { isChineseLocale } = useChineseLocale();

gsap.registerPlugin(CSSPlugin, ScrollTrigger)

const text1 = ref(null)
const text2 = ref(null)
const text3 = ref(null)
const text5 = ref(null)
const text6 = ref(null)
const text7 = ref(null)
const img1 = ref(null)
const img2 = ref(null)
const img3 = ref(null)

/**
 * 辅助函数：获取真实 DOM 元素
 * 如果 ref 指向的不是 DOM 节点，尝试取其 $el 属性
 */
function getEl(refEl: any): any {
  if (refEl.value) {
    return typeof refEl.value.getBoundingClientRect === 'function'
        ? refEl.value
        : (refEl.value.$el || refEl.value)
  }
  return null
}

onMounted(() => {
  nextTick(() => {
    const el1 = getEl(text1)
    const el2 = getEl(text2)
    const el3 = getEl(text3)
    const el5 = getEl(text5)
    const el6 = getEl(text6)
    const el7 = getEl(text7)
    const elImg1 = getEl(img1)
    const elImg2 = getEl(img2)
    const elImg3 = getEl(img3)

    gsap.from(el1, {
      scrollTrigger: { trigger: el1, once: true, start: "top bottom" },
      x: "-100%", opacity: 0, duration: 1, ease: "power2.out"
    });
    gsap.from(el2, {
      scrollTrigger: { trigger: el2, once: true, start: "top bottom" },
      x: "-100%", opacity: 0, duration: 1, ease: "power2.out"
    });
    gsap.from(el5, {
      scrollTrigger: { trigger: el5, once: true, start: "top bottom" },
      x: "-100%", opacity: 0, duration: 1, ease: "power2.out"
    });
    gsap.from(el7, {
      scrollTrigger: { trigger: el7, once: true, start: "top bottom" },
      x: "-100%", opacity: 0, duration: 1, ease: "power2.out"
    });

    gsap.from(el3, {
      scrollTrigger: { trigger: el3, once: true, start: "top bottom" },
      x: "100%", opacity: 0, duration: 1, ease: "power2.out"
    });
    gsap.from(el6, {
      scrollTrigger: { trigger: el6, once: true, start: "top bottom" },
      x: "100%", opacity: 0, duration: 1, ease: "power2.out"
    });

    gsap.from(elImg1, {
      scrollTrigger: { trigger: elImg1, once: true, start: "top bottom" },
      y: "-50%", opacity: 0, duration: 1, ease: "power2.out", delay: 0.2
    });
    gsap.from(elImg2, {
      scrollTrigger: { trigger: elImg2, once: true, start: "top bottom" },
      y: "-50%", opacity: 0, duration: 1, ease: "power2.out", delay: 0.4
    });
    gsap.from(elImg3, {
      scrollTrigger: { trigger: elImg3, once: true, start: "top bottom" },
      y: "-50%", opacity: 0, duration: 1, ease: "power2.out", delay: 0.6
    });
  });
});
</script>

<style lang="scss">
.wider {
  transform: scale(1.2, 1);
}

.narrower {
  transform: scale(0.8, 1);
}

.title-font {
  font: var(--title-font);
  font-size: 31rpx;
}

.binary-rain {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 240px;
}
.chinese {
  font-family: 'unifont jp' !important;
}

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
