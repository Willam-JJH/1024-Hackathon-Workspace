<script setup lang="ts">
import {onMounted, onUnmounted} from "vue";

onMounted(() => {
  // Get title area height
  // const query = uni.createSelectorQuery().in(this);
  // query.select('.text-area')
  //         .boundingClientRect(data => {
  //                 if (data) {
  //                         titleAreaHeight.value = data.height + data.top + 50; // Add 50px padding
  //                 }
  //         }).exec();

  const queryCanvas = uni.createSelectorQuery().in(this)
  queryCanvas.select('#c')
      .fields({node: true, size: true}, (res) => {
      })
      .exec((res) => {
        if (!res[0] || !res[0].node) {
          console.error("Canvas not found");
          return;
        }

        const canvas = res[0].node;
        const ctx = canvas.getContext('2d', {
          willReadFrequently: true,
          desynchronized: true,
          alpha: true,
          colorSpace: 'srgb'
        });

        if (!ctx) {
          console.error("Failed to get canvas context");
          return;
        }

        // Get system info for canvas size
        const sysInfo = uni.getSystemInfoSync();
        const width = sysInfo.windowWidth;
        const height = 270; //real 240

        // Set canvas size
        canvas.width = width;
        canvas.height = height;

        // const chinese = "田由甲申甴电甶男甸甹町画甼甽甾甿畀畁畂畃畄畅畆畇畈畉畊畋界畍畎畏畐畑".split("");
        const chinese = "01".split("");
        const font_size = 18;
        const columns = width / font_size + 1;
        const drops: number[] = Array(Math.floor(columns)).fill(1);

        function draw() {
          //Black BG for the canvas
          //translucent BG to show trail
          ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
          ctx.fillRect(0, 0, width, height);
          ctx.font = `${font_size}px Retropix`;

          drops.forEach((drop, i) => {
            // Calculate opacity based on position
            const maxHeight = height / font_size;
            const opacity = Math.max(0, 1 - (drop / maxHeight));
            ctx.fillStyle = `rgba(0, 255, 194, ${opacity})`;

            const text = chinese[Math.floor(Math.random() * chinese.length)];
            ctx.fillText(text, i * font_size, drop * font_size);

            if (drop * font_size > height - 50 && Math.random() > 0.9575) {
              drops[i] = 0;
            }
            drops[i]++;
          });
        }

        const interval = setInterval(draw, 66);

        onUnmounted(() => {
          clearInterval(interval);
        });
      });
});
</script>

<template>
  <canvas id="c" class="binary-rain"></canvas>
</template>

<style scoped lang="scss">
.binary-rain {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 240px;
  // clip-path: polygon(
  //         -70% 0,      /* Left point: (x=0%, y=0%) */
  //         170% 0,   /* Right point */
  //         50% 95%  /* Bottom point */
  // );
  // clip-path: ellipse(50% 90% at 50% 0%);
  /*
     x-radius
     y-radius
     at 50% 0%
  */
}
</style>