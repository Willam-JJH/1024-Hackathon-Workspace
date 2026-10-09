<template>
  <view class="layout--gradient-index" :class="{ 'chinese-locale': isChineseLocale }">
    <view class="background-overlay"></view>
    <LanguageSwitcher />

    <view class="content overflow-hidden">
      <!-- <image class="logo" src="/static/logo.png" /> -->
      <!-- <view class="text-area">
        <text class="title">{{ title }}</text>
      </view> -->

      <view class="text-area" style="width: 100%"> <!-- Changed from fit-content to 100% -->
        <view class="info-right">
          <view class="title-group glitch">
            <text class="title title--accent">{{ $t('main.buildThe') }}</text>
            <text class="title title--accent">{{ $t('main.nextBigThing') }}</text>
            <text class="title title--accent">{{ $t('main.withAi') }}</text>
          </view>
          <text class="smoltitle" style="font-size: 32rpx;">{{ $t('main.hackTheFuture') }}</text>
        </view>

        <text class="info white text-left" style="padding-left: 1.5rem;">
          {{ $t('mainDescription.prefix') }}
          <text class="info" style="margin: -0.25rem">{{ $t('mainDescription.teen') }}</text>
          <text class="accent" style="margin: -0.25rem">{{ $t('mainDescription.ai') }}</text>
          <text class="info" style="margin: -0.25rem">{{ $t('mainDescription.gers') }}</text>
          {{ $t('mainDescription.middle') }}
          <text class="info" style="margin: -0.5rem">{{ $t('mainDescription.emphasis') }}</text>
          {{ $t('mainDescription.conjunction') }}
          <text class="info" style="margin: -0.25rem">{{ $t('mainDescription.suffix') }}</text>
        </text>

        <Widget />
      </view>

      <view class="prizes-section">
        <text class="section-title" style="font-size: xx-large;">{{ $t('prizes.title') }}</text>
        <view class="prize-container">
          <view class="flex w-1/2">
            <image src="@/static/icon/money.svg" class="relative scale-[2.2] prize-image top-6" />
          </view>

          <view class="prize-text wider">
            <text class="prize-amount wider">{{ $t('prizes.amount') }}</text>
            <br>
            <text class="prize-desc wider">{{ $t('prizes.description') }}</text>
          </view>
        </view>
      </view>

      <view class="team-section">
        <text class="section-title" style="font-size: x-large;">{{ $t('team.checkOut') }}</text>
        <br>
        <text class="section-title" style="font-weight: bolder; font-size: xx-large;">{{ $t('team.title') }}</text>
        <scroll-view class="scroll-view team-members" scroll-x="true" show-scrollbar="false">
          <view v-for="(member, index) in teamMembers" :key="index" class="scroll-view-item team-member">
            <image :src="member.image" class="team-image relative scale-[1]" />
            <text class="member-name wider">{{ member.name }}</text>
            <text class="member-role wider">{{ member.role }}</text>
          </view>
        </scroll-view>
      </view>

      <partners />

      <view class="faq-section">
        <text class="section-title" style="font-size: xx-large;">{{ $t('faq.title') }}</text>
        <br>
        <view class="faq-container">
          <view v-for="index in 6" :key="index" class="faq-item" :class="{ active: faqs[index - 1].isOpen }">
            <view class="faq-question" :class="{ active: faqs[index - 1].isOpen }" @tap="toggleFaq(index)">
              {{ $t(`faq.q${index}`) }}
              <span class="arrow-down" :class="{ 'faq-icon-open': faqs[index - 1].isOpen }">▼</span>
            </view>
            <view class="faq-answer" :class="{ active: faqs[index - 1].isOpen }">
              {{ $t(`faq.a${index}`) }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import partners from '@/components/partners.vue'
import Widget from "@/components/widget.vue";

import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import { useChineseLocale } from '@/composables/useChineseLocale';
const { isChineseLocale } = useChineseLocale();

onMounted(() => {
  // uni.hideTabBar();
})
import { ref } from 'vue';


const teamMembers = ref([
  {
    name: 'Carry',
    role: 'pog',
    image: '/static/picture/carry.jpeg'
  },
  {
    name: 'Alvin',
    role: 'hi',
    image: '/static/picture/alvin.jpeg'
  },
  {
    name: 'Henry',
    role: 'erm',
    image: '/static/picture/henry.jpeg'
  },
  {
    name: 'Corton',
    role: 'yummers',
    image: '/static/picture/corton.jpeg'
  }
]);

const faqs = ref(Array(6).fill().map(() => ({ isOpen: false }))); //this cuz localization btu need isopen var
const toggleFaq = (index) => {
  faqs.value[index - 1].isOpen = !faqs.value[index - 1].isOpen;
};


</script>


<style lang="scss" scoped>
.scroll-view {
  white-space: nowrap;
  width: 100%;
}

.scroll-view-item {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 150rpx;
  min-height: 350rpx;
  padding: 5rpx 0;
  min-width: 300rpx;
  margin: 0 5rpx;
  border: 2px solid #ffffff;
  background: rgba(0, 0, 0, 0.6);
}

.team-section {
  margin-bottom: 40rpx;
  width: 90%;
}

.team-members {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  padding: 10px 0;
}

.team-member {
  flex: 0 0 auto;
  width: 250rpx;
  min-width: 250rpx;
  margin: 0 10rpx;
  border: 2px solid #ffffff;
  // padding: 1rem;
  background: rgba(0, 0, 0, 0.6);
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // box-sizing: border-box;
  // justify-content: center;
}

.team-image {
  width: 140rpx;
  height: 140rpx;
  margin-bottom: 20rpx;
}

.member-name {
  font-family: var(--title-font);
  color: #fff;
  font-weight: bold;
  margin: 0.5rem 0;
  display: block;
  width: 100%;
  text-align: center;
}

.member-role {
  font-family: var(--title-font);
  color: #fff;
  display: block;
  width: 100%;
  text-align: center;
}

.info-right {
  text-align: right;
  padding: 40rpx;
  margin-top: 40rpx;
  width: 100%;

  .info {
    font-size: 32rpx;
    color: #00ffc2;
    font-weight: bold;
  }
}

.title-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 0;
}

.title {
  white-space: pre-wrap;
  word-wrap: break-word;
  width: 100%;
  display: block;
  margin-bottom: 10px;
  min-width: 0;
}


.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  background-image: url('@/static/picture/linesmenubg.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: absolute;
  z-index: 0;
}

.gradient-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 600px; //height for the fade thing to appear
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%);
  pointer-events: none;
  z-index: 1;
}

.content {
  position: relative;
  z-index: 2;
}

.prize-box {
  display: flex;
  background: rgba(0, 0, 0, 0.8);
  margin: 10rpx;
  padding: 10rpx;
}

.prize-container {
  padding: 0 20rpx 0 20rpx;

  flex: 1;
  border: 3px solid rgba(255, 255, 255, 0.5);

  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 240rpx;
  background-color: rgba(0, 0, 0, 0.5);
}

.prize-image {
  width: 125rpx;
  height: 125rpx;
  margin-right: 0rpx;
}

.prize-amount {
  font-family: var(--title-font);
  color: var(--primary);
  font-size: 36rpx;
  margin-bottom: 10rpx;
}

.prize-desc {
  font-family: var(--title-font);
  color: #fff;
  font-size: 28rpx;
}

.prizes-section {
  margin-bottom: 3rem;
  width: 85%;
}


.green {
  color: #00ff00;
}

.white {
  color: #ffffff;
  font-family: var(--text-font);
}

.team-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  padding: 0 20px;

  &::after {
    content: '';
    flex: auto;
  }
}



.section-container {
  padding: 20rpx;
  margin: 20rpx auto;
  width: 90%;
}

.section-title {
  font-size: 48rpx;
  font-family: var(--title-font);
  font-weight: bold;
  color: #fff;
  text-align: center;
  margin-bottom: 40rpx;
}

.faq-section {
  margin-bottom: 40rpx;
  width: 90%;
}

.faq-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  // padding: 0 1rem;
  padding: 20rpx;
  background-color: rgba(0, 0, 0, 0.5);
  border: 1px solid #fff;
}

.faq-item {
  background-color: rgba(0, 0, 0, 0.7);
  margin-bottom: 1rem;
  border: 2px solid #fff;
}

.faq-question {
  padding: 20rpx;
  font-family: var(--text-font);
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.arrow-down {
  color: var(--white);
  transition: transform 0.25s ease;
}

.faq-icon-open {
  transform: rotate(180deg);
}

.faq-answer {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  font-family: var(--text-font);
  padding: 0 1rem;
  transition: all 0.25s ease;
  background-color: rgba(0, 0, 0, 0.95);
  color: var(--primary);
}

.faq-answer.active {
  max-height: 300px;
  opacity: 1;
  padding: 1rem;
}

.faq-question.active {
  color: var(--primary);
  transition: all 0.25s ease;
  background-color: rgba(0, 0, 0, 0.95);
}

.faq-item.active {
  background-color: rgba(0, 0, 0, 0.95);
  border: 2px solid var(--primary);
}


.widget-container {
  flex: 1;
  border: 3px solid rgba(255, 255, 255, 0.5);
  margin: 2rem auto;
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background-color: rgba(0, 0, 0, 0.5);
}



.wider {
  transform: scale(1.5, 1);
}

</style>