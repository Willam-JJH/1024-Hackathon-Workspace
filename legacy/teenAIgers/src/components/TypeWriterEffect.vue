<template>
  <div class="relative typewriter-container">
    <div ref="placeholder" class="placeholder">
      <slot />
    </div>
    <div ref="typerContainer" class="absolute top-0 left-0"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import TypeIt from 'typeit'

const placeholder = ref(null)
const typerContainer = ref(null)

const props = defineProps({
  use_placeholder: {
    type: Boolean,
    default: true
  }
})

onMounted(async () => {
  await nextTick()
  // console.log(props.use_placeholder)
  const content = placeholder.value.innerHTML.trim()

  typerContainer.value.innerHTML = ''

  // 初始化 TypeIt：注意开启 html 模式以支持格式化文本
  new TypeIt(typerContainer.value, {
    html: true,           // 支持 HTML 格式
    strings: [content],   // 使用提取的内容
    speed: 20,           // 每个字符的间隔，可根据需求调整
    cursor: props.use_placeholder,         // 启用光标显示
    waitUntilVisible: true, // 当元素可见时才开始打字
    breakLines: false,    // 如果需要换行可调整此项
  }).go();
});
</script>

<style scoped>
.typewriter-container {
  position: relative;
}

.placeholder {
  visibility: hidden;
}

.cursor {
  font-weight: bold;
  color: #FF0000; /* 修改这里的颜色值，比如红色 */
  animation: blink 1s step-start infinite;
  margin-left: 0.25rem;
}

</style>
