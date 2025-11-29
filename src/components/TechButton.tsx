"use client";
import { motion } from "framer-motion";

interface TechButtonProps {
  text: string;
  onClick?: () => void;
}

export default function TechButton({ text, onClick }: TechButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative group px-6 py-2 bg-transparent border border-white/20 text-white font-mono text-sm tracking-widest uppercase overflow-hidden"
      // CSS clip-path 实现右下角切角
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%)" }}
    >
      {/* 悬停时的黄色滑块动画 */}
      <div className="absolute inset-0 bg-endfield-accent translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out" />
      
      {/* 按钮文字 */}
      <span className="relative z-10 group-hover:text-black transition-colors duration-200 font-bold">
        {text}
      </span>
    </motion.button>
  );
}