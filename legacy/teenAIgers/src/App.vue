<script setup lang="ts">
import {onLaunch, onShow, onHide, onPageNotFound} from "@dcloudio/uni-app";

onLaunch(() => {
  console.log("App Launch");

});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
onPageNotFound((param) => {
  console.log("Page Not Found");
  uni.navigateTo({
    url: "/pages/default/error",
    complete: () => {
      console.log("Redirected to Error Page");
    }
  });
  uni.navigateBack({
    delta: 1
  });
});
</script>
<style lang="scss">
@use "@/styles/main.scss";
@import '@/static/fonts/fonts.css';
@import url('@/styles/tailwind.css');

.uni-app--showtopwindow uni-page-head {
	display: none;
}
</style>
