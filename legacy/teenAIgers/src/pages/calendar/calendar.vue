<template>
  <view class="layout--gradient-only" :class="{ 'chinese-locale': isChineseLocale }">
    <LanguageSwitcher/>

    <view class="content">
      <view class="schedule-section">
        <view class="section-title">📅 SCHEDULE</view>
        <view class="schedule-container">
          <view class="schedule-item">
            <view class="schedule-time">DAY 1</view>
            <view class="schedule-event">
              <h3>Registration & Opening Ceremony</h3>
              <p>9:00 AM - 11:00 AM</p>
            </view>
          </view>
          <view class="schedule-item">
            <view class="schedule-time">DAY 1</view>
            <view class="schedule-event">
              <h3>Problem Hacking Begins</h3>
              <p>11:30 AM</p>
            </view>
          </view>
          <view class="schedule-item">
            <view class="schedule-time">DAY 2</view>
            <view class="schedule-event">
              <h3>Checkpoint & Mentoring</h3>
              <p>10:00 AM - 12:00 PM</p>
            </view>
          </view>
          <view class="schedule-item">
            <view class="schedule-time">DAY 3</view>
            <view class="schedule-event">
              <h3>Submissions Due</h3>
              <p>3:00 PM</p>
            </view>
          </view>
          <view class="schedule-item">
            <view class="schedule-time">DAY 3</view>
            <view class="schedule-event">
              <h3>Judging & Awards</h3>
              <p>5:00 PM - 7:00 PM</p>
            </view>
          </view>
          <view class="schedule-item">
            <view class="schedule-time">DAY 3</view>
            <view class="schedule-event">
              <h3>Judging & Awards</h3>
              <p>5:00 PM - 7:00 PM</p>
            </view>
          </view>


        </view>
        <partners/>
      </view>
      <!-- partner section? -->
    </view>
  </view>
</template>

<script setup lang="js">

import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import {useChineseLocale} from '@/composables/useChineseLocale';

const {isChineseLocale} = useChineseLocale();
import partners from '@/components/partners.vue'

</script>

<style lang="scss" scoped>
.section-title {
  font-family: var(--title-font);
  font-weight: bold;
  color: #fff;
  text-align: center;
  font-size: 48rpx;
  margin-bottom: 40rpx;
}


.schedule-section {
  margin-bottom: 40rpx;
  width: 90%;
}

.schedule-container {
  padding: 0 20rpx;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
}

.schedule-item {
  background-color: rgba(0, 0, 0, 0.5);
  margin-bottom: 20rpx;
  padding: 20rpx;
  color: var(--primary);
  border: 3px solid #000;
  display: flex;
}


.schedule-time {
  font-weight: bold;
  margin-right: 20rpx;
  min-width: 160rpx;
}


.schedule-event h3 {
  margin-bottom: 10rpx;
}

.schedule-event p {
  font-size: 24rpx;
  color: #fff;
}

</style>