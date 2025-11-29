"use client";
import { useEffect, useRef } from "react";

export default function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    
    // 字符集：使用片假名+数字，更有赛博感
    const columns = Math.floor(width / 20);
    const drops: number[] = new Array(columns).fill(1);
    const chars = "ABCDEF0123456789アイウエオカキクケコサシスセソタチツテト";

    const draw = () => {
      // 每一帧覆盖一层半透明黑，形成拖尾效果
      ctx.fillStyle = "rgba(9, 9, 11, 0.05)"; 
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#1f2937"; // 深灰色文字，不抢视觉重心
      ctx.font = "14px 'JetBrains Mono'";

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);

        // 随机重置
        if (drops[i] * 20 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-40"
    />
  );
}