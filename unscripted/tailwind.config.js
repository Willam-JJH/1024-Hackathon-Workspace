/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["TschicholdArchiType", "Noto Sans SC", "sans-serif"],
        // 和 index.css 的 body 规则保持一致
        body: ["'Times New Roman'", "Times", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", "sans-serif"],
        // 原来叫 pixel，用像素字体渲染小标签。像素字体对拉丁字母可读性不好，
        // 改成衬线体；末尾的 monospace 是给中文留的回退，行为和以前一致。
        label: ["'Times New Roman'", "Times", "monospace"],
        // 像素字体现在只留给 "AI" 这一个词（见 RichText 的 %% 标记）
        retro: ["Retropix", "monospace"],
      },
      colors: {
        ink: {
          black: "#000000",
          dark: "#0a0a0a",
          gray: "#1c1c1c",
          line: "#2e2e2e",
        },
        acid: {
          DEFAULT: "hsl(var(--primary))",
          dim: "hsl(var(--primary-dim))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        blink: "blink 1.1s step-end infinite",
      },
    },
  },
  plugins: [],
};
