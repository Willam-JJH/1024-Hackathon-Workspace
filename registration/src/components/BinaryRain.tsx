import React, { useEffect, useRef } from 'react';

const BinaryRain: React.FC = () => {
        const canvasRef = useRef<HTMLCanvasElement>(null);

        useEffect(() => {
                const canvas = canvasRef.current;
                if (!canvas) return;

                const ctx = canvas.getContext('2d', {
                        willReadFrequently: true,
                        alpha: true,
                });

                if (!ctx) return;

                // Set canvas size
                const width = window.innerWidth;
                const height = 270;
                canvas.width = width;
                canvas.height = height;

                const binary = "01".split("");
                const fontSize = 18;
                const columns = width / fontSize + 1;
                const drops: number[] = Array(Math.floor(columns)).fill(1);

                const draw = () => {
                        // Black BG with slight transparency for trail effect
                        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
                        ctx.fillRect(0, 0, width, height);

                        ctx.font = `${fontSize}px Retropix`;

                        drops.forEach((drop, i) => {
                                // Calculate opacity based on position
                                const maxHeight = height / fontSize;
                                const opacity = Math.max(0, 1 - (drop / maxHeight));
                                ctx.fillStyle = `rgba(0, 255, 194, ${opacity})`;

                                const text = binary[Math.floor(Math.random() * binary.length)];
                                ctx.fillText(text, i * fontSize, drop * fontSize);

                                // Reset drop after it reaches bottom with a random chance
                                if (drop * fontSize > height - 50 && Math.random() > 0.9575) {
                                        drops[i] = 0;
                                }
                                drops[i]++;
                        });
                };

                const interval = setInterval(draw, 66);

                return () => clearInterval(interval);
        }, []);

        return (
                <canvas
                        ref={canvasRef}
                        className="absolute left-0 top-0 z-0 h-[240px] w-full"
                        style={{ height: '240px' }}
                />
        );
};

export default BinaryRain;
