import { useEffect, useRef } from "react";

interface BinaryRainProps {
  /** 画布高度 */
  height?: number;
  /** 每帧间隔（毫秒），调大 = 更慢 */
  interval?: number;
  className?: string;
}

/**
 * 0/1 二进制雨。纯装饰，不承载信息。
 * 用 setInterval 而不是 requestAnimationFrame，保证低配设备上也不会吃满 GPU。
 */
const BinaryRain = ({ height = 220, interval = 90, className = "" }: BinaryRainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontSize = 14;
    let columns = 0;
    let drops: number[] = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.offsetWidth;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      columns = Math.floor(width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -40);
    };

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.offsetWidth, height);

      ctx.font = `${fontSize}px Retropix, monospace`;

      for (let i = 0; i < columns; i++) {
        const char = Math.random() > 0.5 ? "1" : "0";
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // 队首字符更亮，形成拖尾感
        ctx.fillStyle = "hsl(82, 94%, 72%)";
        ctx.fillText(char, x, y);

        ctx.fillStyle = "hsl(82, 60%, 34%)";
        ctx.fillText(char, x, y - fontSize);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 1;
      }
    };

    resize();
    const timer = window.setInterval(draw, interval);
    window.addEventListener("resize", resize);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("resize", resize);
    };
  }, [height, interval]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none w-full ${className}`}
      style={{ height }}
    />
  );
};

export default BinaryRain;
