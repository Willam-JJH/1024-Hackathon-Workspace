<script setup lang="ts">
import Byterain from "@/components/byterain.vue";
import Slogan from "@/components/slogan.vue";
import { defineProps } from "vue";

const props = defineProps<{
  status?: string;
  message?: string;
}>();
</script>

<template>
  <view class="absolute w-full flex flex-col items-center">
    <byterain class="opacity-35 z-0"/>
    <slogan class="z-10"/>
  </view>

  <view class="layout--slowgradient z-10 h-[100vh] w-full flex flex-col items-center justify-center">
    <view id="cont1" class="flex flex-col items-center justify-center">
      <view class="flex flex-col items-center justify-center">
        <text class="text-4xl text-emerald-50 font-bold content-text">
          {{ props.status || "404" }}
        </text>
        <text class="text-2xl text-emerald-50 content-text">
          {{ props.message || "Page not found :(" }}
        </text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
</style>
