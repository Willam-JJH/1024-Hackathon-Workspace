<script setup lang="ts">

</script>

<template>
  <view class="partners-section w-full">
    <text class="section-title" style="font-size: xx-large;">{{ $t('partners.title') }}</text>
    <view class="partner-box">
      <view class="flex w-1/1">
        <img src="@/static/picture/vamos.png" class="partner-logo relative scale-[1.4] right-5"/>
      </view>

      <text class="partner-text chinese">万思未来馆</text>
    </view>
    <br>
    <view class="partner-box">
      <text class="partner-text chinese">高才通人才服务协会</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.partners-section {
  padding: 0 20rpx;
  margin-bottom: 2rem;
  width: 90%;
}

.partner-box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 0.25rem;
  border: 3px solid rgba(255, 255, 255, 0.5);
  background-color: rgba(255, 255, 255, 0.7);
}

.partner-logo {
  width: 130px;
  height: 130px;
  margin-right: 1rem;
}

.partner-text {
  font-family: var(--title-font);
  color: #000;
  font-size: 1.5rem;
}
</style>