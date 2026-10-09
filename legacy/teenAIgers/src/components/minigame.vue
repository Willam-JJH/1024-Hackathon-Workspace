<template>
  <view class="w-full h-full">
    <!-- 骨架屏 -->
    <view v-if="!iframeLoaded" class="skeleton-screen w-full h-full">
      <view class="skeleton-header"></view>
      <view class="skeleton-controls"></view>
      <view class="skeleton-content">
        <view class="skeleton-left"></view>
        <view class="skeleton-center"></view>
        <view class="skeleton-right"></view>
      </view>
    </view>
    
    <iframe 
      v-show="iframeLoaded"
      ref="iframeRef"
      src="/public/html/index.html"
      width=""
      class="w-full h-full"
      style="border: none; min-height: 600px;"
      @load="handleIframeLoaded"
    />
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const iframeLoaded = ref(false);
const iframeRef = ref<HTMLIFrameElement | null>(null);

const handleIframeLoaded = () => {
  iframeLoaded.value = true;
  console.log('iframe 已加载完成');
};

onMounted(() => {
  loadJS('/public/js/lib.js');
  loadJS('/public/js/bundle.js');
  
  // 防止iframe内容滚动
  const iframe = document.querySelector('iframe');
  // iframe?.addEventListener('load', () => {
  //   if (iframe.contentDocument) {
  //     iframe.contentDocument.body.style.overflow = 'hidden';
  //   }
  // });
});

const loadJS = (src: string) => {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.onload = () => {
    console.log(`${src} 已加载完成`);
  };
  document.head.appendChild(script);
};
</script>

<style lang="scss" scoped>
@import "/public/css/bundle.css";

iframe {
  background: white;
  //box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  overflow: clip;
}

.skeleton-screen {
  background: white;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-header {
  height: 48px;
  background: #f0f0f0;
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-controls {
  height: 36px;
  background: #f0f0f0;
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-content {
  flex: 1;
  display: flex;
  gap: 16px;
}

.skeleton-left, .skeleton-right {
  width: 25%;
  background: #f0f0f0;
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-center {
  flex: 1;
  background: #f0f0f0;
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.6;
  }
}
</style>