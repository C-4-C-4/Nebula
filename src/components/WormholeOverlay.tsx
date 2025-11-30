"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function WormholeOverlay({ isWarping }: { isWarping: boolean }) {
  const [phase, setPhase] = useState(0); // 0:静止, 1:加速, 2:闪光穿越

  useEffect(() => {
    if (isWarping) {
      setPhase(1);
      // 1.8秒后触发闪光，配合路由跳转
      const timer = setTimeout(() => setPhase(2), 1800);
      return () => clearTimeout(timer);
    } else {
      setPhase(0);
    }
  }, [isWarping]);

  return (
    <AnimatePresence>
      {isWarping && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black overflow-hidden flex items-center justify-center"
        >
          {/* === 核心：虫洞隧道 === */}
          {/* 通过极大的缩放模拟穿越 */}
          <motion.div
            initial={{ scale: 0.1, opacity: 0 }}
            animate={{ 
              scale: [1, 5, 20], // 变大
              opacity: [0, 1, 1],
              rotate: 180 
            }}
            transition={{ duration: 2, ease: "circIn" }} // 指数级加速
            className="absolute inset-0 w-full h-full"
          >
            {/* 使用锥形渐变模拟速度线 */}
            <div 
              className="w-[200vw] h-[200vw] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: `
                  conic-gradient(
                    from 0deg, 
                    transparent 0deg, 
                    rgba(252, 238, 33, 0.1) 10deg, 
                    transparent 20deg, 
                    rgba(0, 240, 255, 0.1) 40deg, 
                    transparent 60deg, 
                    rgba(255, 255, 255, 0.8) 90deg, 
                    transparent 120deg
                  ),
                  radial-gradient(circle, transparent 30%, black 70%)
                `,
                filter: "blur(2px)",
              }}
            />
          </motion.div>

          {/* === 辅助层：快速飞过的粒子 === */}
          <div className="absolute inset-0 w-full h-full">
             {[...Array(20)].map((_, i) => (
               <motion.div
                 key={i}
                 initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                 animate={{ 
                   x: (Math.random() - 0.5) * 2000, 
                   y: (Math.random() - 0.5) * 1000, 
                   scale: Math.random() * 2 + 0.5,
                   opacity: [0, 1, 0]
                 }}
                 transition={{ 
                   duration: 0.5 + Math.random(), 
                   repeat: Infinity, 
                   ease: "linear",
                   delay: Math.random() * 0.5
                 }}
                 className="absolute top-1/2 left-1/2 w-1 h-20 bg-white rounded-full origin-center"
                 style={{ rotate: `${Math.random() * 360}deg` }}
               />
             ))}
          </div>

          {/* === 中心奇点 === */}
          <motion.div 
            animate={{ scale: [1, 0.5, 50] }} // 先收缩蓄力，再瞬间爆发
            transition={{ duration: 2, times: [0, 0.8, 1] }}
            className="relative z-10 w-2 h-2 bg-white rounded-full shadow-[0_0_50px_20px_white]"
          />

          {/* === 最后的白光闪现 (遮住页面跳转的瞬间) === */}
          {phase === 2 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-white z-50"
            />
          )}

          {/* === UI 文字提示 === */}
          <div className="absolute bottom-20 text-center z-20">
             <div className="text-endfield-accent font-mono text-xl font-bold tracking-[0.5em] animate-pulse">
               WARP_DRIVE_ENGAGED
             </div>
             <div className="text-xs text-gray-500 font-mono mt-2">
               TRAJECTORY: SECTOR_NEBULA // VELOCITY: 9.8c
             </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}