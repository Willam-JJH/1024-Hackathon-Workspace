<template>
  <div class="quotes-carousel">
    <div class="quotes-container w-full">
      <div class="quote-marks">&ldquo;&rdquo;</div>
      <transition name="fade" mode="out-in">
        <div :key="currentQuoteIndex" class="quote-content">
          {{ quotes[currentQuoteIndex] }}
        </div>
      </transition>
      <button class="nav-arrow left" @click="prevQuote">
        <span>&lt;</span>
      </button>
      <button class="nav-arrow right" @click="nextQuote">
        <span>&gt;</span>
      </button>
    </div>
    <div class="pagination-dots">
      <span
          v-for="(_, index) in quotes"
          :key="index"
          class="dot"
          :class="{ active: index === currentQuoteIndex }"
          @click="goToQuote(index)"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuotesCarousel',
  data() {
    return {
      currentQuoteIndex: 0,
      quotes: [
        "If something's important enough you should try. Even if the probable outcome is failure.",
        "When something is important enough, you do it even if the odds are not in your favor.",
        "Be the best version of yourself in anything you do. You don’t have to live anybody else’s story.",
        "I think most people can learn a lot more than they think they can. They sell themselves short without trying.",
        "I think it is possible for ordinary people to choose to be extraordinary."
      ]
    }
  },
  methods: {
    nextQuote() {
      this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.quotes.length;
    },
    prevQuote() {
      this.currentQuoteIndex = (this.currentQuoteIndex - 1 + this.quotes.length) % this.quotes.length;
    },
    goToQuote(index) {
      this.currentQuoteIndex = index;
    }
  }
}
</script>

<style scoped>
.quotes-carousel {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.quotes-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  color: #7DFFA8;
  padding: 60px 80px;
  border-radius: 8px;
  height: 300px; /* Fixed height */
  user-select: none;
  overflow: hidden; /* Prevent content overflow */
}

.quote-marks {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 80px;
  color: #7DFFA8;
  opacity: 0.5;
  line-height: 0.5;
}

.quote-content {
  position: absolute; /* prevent container change size when diff length of quote*/
  width: 75%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); /* center content */
  font-size: 18px;
  text-align: center;
  font-family: monospace;
  z-index: 1;
  transition: transform 0.3s ease;
  /* transition: opacity 0.3s ease; */
}

/* Navigation arrows */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #7DFFA8;
  font-size: 40px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s;
  z-index: 2;
}

.nav-arrow:hover {
  opacity: 1;
}

.nav-arrow.left {
  left: 10px;
}

.nav-arrow.right {
  right: 10px;
}

/* Pagination dots */
.pagination-dots {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #333;
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dot.active {
  background-color: #7DFFA8;
}

/* Transition for text transformation */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>