"use client";
import { motion } from "framer-motion";

export default function ScrollGuide() {
  return (
    <div className="w-full flex justify-center items-center py-10 pointer-events-none select-none">
      <div className="flex flex-col items-center gap-2">
        
        {/* 装饰文字 */}
        <span className="text-[9px] font-mono text-gray-600 tracking-[0.3em] uppercase">
          Scroll_Down
        </span>

        {/* 箭头动画容器 */}
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          {/* 垂线光束 */}
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-endfield-accent to-transparent" />
          
          {/* 箭头图标 (SVG) */}
          <svg 
            width="16" 
            height="10" 
            viewBox="0 0 16 10" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="mt-[-1px]" // 紧贴垂线
          >
            <path d="M1 1L8 8L15 1" stroke="#FCEE21" strokeWidth="1.5" />
          </svg>
        </motion.div>

      </div>
    </div>
  );
}