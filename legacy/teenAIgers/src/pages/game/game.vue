<template>
  <view class="overflow-hidden layout--gradient-only overscroll-contain z-10">
    <!-- 背景层 -->
    <view class="absolute w-full flex flex-col items-center">
      <byterain class="opacity-85 z-0"/>
      <slogan class="z-10"/>
    </view>

    <!-- 动画球层 -->
    <view class="relative h-[100vh] w-full flex flex-col items-center justify-center"
          :class="{ 'chinese-locale': isChineseLocale }">
      <LanguageSwitcher/>
      <view id="cont1" class="flex flex-col items-center justify-center">
        <img ref="ball1" src="@/static/icon/ball1.svg" class="relative right-70 top-30">
        <img ref="ball3" src="@/static/icon/ball3.svg" class="relative w-12 bottom-20 z-100 left-38">
        <img ref="ball2" src="@/static/icon/ball2.svg" class="relative w-30 bottom-10 z-10 left-40">
      </view>
    </view>
    <view @click="scrollToBottom"
        class="relative bottom-35  w-full flex text-[15px] flex-col content-text text-center items-center justify-center">
      <TypeWriterEffect class=" flex flex-col text-center" :use_placeholder="false">
        <view class="">
          <p class="w-full">Check out what have we prepared for you :)👇</p>
        </view>
      </TypeWriterEffect>
    </view>

    <view class="relative top-40 game-section w-[100%]">
      <h2 class="section-title">🎮 GAME ZONE</h2>
      <div class="game-container">
        <div class="game-intro">
          <h3>HACK & PLAY</h3>
          <p>Take a break from coding and enjoy some cool minigames!</p>
        </div>
        <!-- <div class="game-widget">
          <div class="widget-container">
            <h2>GAME GOES HERE</h2>
            <p>Coming soon...</p>
          </div>
        </div> -->
      </div>
    </view>

    <!-- 游戏容器层 -->
    <view class="relative top-15 z-20 w-full flex
                  flex-col items-center justify-center">
      <view class="scale-60 w-[160vw] h-[80vh] bg-white rounded-lg shadow-lg p-1">
        <minigame class=" z-1 h-full"/>
      </view>
    </view>
  </view>
</template>


<script setup lang="ts">
import {onMounted, ref} from 'vue';

import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import {useChineseLocale} from '@/composables/useChineseLocale';

const {currentLanguage, isChineseLocale} = useChineseLocale();


import gsap from 'gsap';

import Slogan from "@/components/slogan.vue";
import Byterain from "@/components/byterain.vue";
import Minigame from "@/components/minigame.vue";
import TypeWriterEffect from "@/components/TypeWriterEffect.vue";

// 使用 ref 绑定 DOM 元素
const ball1 = ref<HTMLElement | null>(null);
const ball2 = ref<HTMLElement | null>(null);
const ball3 = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  console.log('scrolling to bottom');
  console.log('Current scroll height:', document.documentElement.scrollHeight);
  console.log('Current scroll position:', document.documentElement.scrollTop);
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth',
  });
};
onMounted(() => {
  if (ball1.value && ball2.value && ball3.value) {
    gsap.from(ball1.value, {
      x: "-100vw",
      duration: 0.75,
      ease: "power2.out",
    });

    gsap.from(ball2.value, {
      y: "100vh",
      duration: 0.75,
      ease: "power2.out",
      delay: 0.1,
    });

    gsap.from(ball3.value, {
      x: "100vw", // 从底部进入
      duration: 0.75,
      ease: "power2.out",
      delay: 0.075, // 稍后一点进入
    });

    gsap.to(ball1.value, {
      y: -10,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: "sine.inOut",
    });

    gsap.to(ball2.value, {
      x: 10,
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: "sine.inOut",
    });

    gsap.to(ball3.value, {
      y: 10,
      repeat: -1,
      yoyo: true,
      duration: 2.5,
      ease: "sine.inOut",
    });
  }
});
</script>

<style lang="scss" scoped>

.section-title {
  font-size: 24px;
  font-family: var(--title-font);
  font-weight: bold;
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
}

.game-section {
  margin-bottom: 2rem;
  width: 90%;
}

.game-container {
  padding: 0 1rem 0 1rem;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
}


.game-intro {
  background-color: rgba(0, 0, 0, 0.5);
  margin-bottom: 1rem;
  color: var(--primary);
  border: 3px solid #000;
  padding: 1.5rem;
  text-align: center;
}

.game-intro p {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #fff;
}


//.content {
//        display: flex;
//        flex-direction: column;
//        align-items: center;
//        justify-content: center;
//}
//
//.logo {
//        height: 200rpx;
//        width: 200rpx;
//        margin-top: 200rpx;
//        margin-left: auto;
//        margin-right: auto;
//        margin-bottom: 50rpx;
//}
//
//.text-area {
//        display: flex;
//        justify-content: center;
//}
//
//.title {
//        font-size: 36rpx;
//        color: #8f8f94;
//}
</style>
