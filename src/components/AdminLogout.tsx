"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLogout({ onLogout }: { onLogout: () => Promise<void> }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // 动画流程：
    // 0s-0.8s: CRT 关机动画
    // 0.8s-2.0s: 显示 "SYSTEM HALTED" 文字，填补跳转等待期
    // 2.0s: 执行跳转
    setTimeout(async () => {
      await onLogout();
    }, 2000);
  };

  return (
    <>
      <div className="mt-auto pt-6 border-t border-white/10">
         <button 
           onClick={handleLogout}
           disabled={isLoggingOut}
           className="w-full border border-red-500/30 text-red-500 py-3 text-xs font-bold hover:bg-red-500 hover:text-black transition-colors uppercase tracking-widest flex justify-center items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
         >
           <span className="w-2 h-2 bg-red-500 rounded-full group-hover:bg-black transition-colors" />
           [ DISCONNECT_SESSION ]
         </button>
         <div className="text-center text-[9px] text-gray-600 mt-2">
           SECURE LOGOUT REQUIRED AFTER OPERATIONS
         </div>
      </div>

      {/* === CRT 关机动画层 === */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            // 关键修改：移除 exit 动画，让黑屏一直保持直到页面跳转销毁
            // 这样就不会出现“黑屏突然消失露出后台页面”的闪烁
          >
            {/* 1. 屏幕内容坍缩动画 (保持不变) */}
            <motion.div 
              className="absolute inset-0 bg-white"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ 
                scaleY: [0, 0.02, 0.02, 0], 
                scaleX: [1, 1, 0, 0],       
                opacity: [0, 1, 1, 0] 
              }}
              transition={{ duration: 0.6, times: [0, 0.1, 0.8, 1] }}
            />

            {/* 2. 警告文字 (前0.8秒出现) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 1, 0], scale: 1.1 }}
              transition={{ duration: 0.8, times: [0, 0.2, 0.8, 1] }}
              className="text-red-600 font-mono text-4xl font-bold tracking-widest z-20 text-center absolute"
            >
              <div className="animate-pulse">CONNECTION_LOST</div>
            </motion.div>

            {/* 3. 最后的黑屏噪点 (保持不变) */}
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5, duration: 1 }}
               className="absolute inset-0 bg-[url('https://placehold.co/100x100/000000/222222/png?text=NO_SIGNAL')] bg-repeat opacity-20 mix-blend-overlay"
            />

            {/* === 4. 新增：填补跳转空白期的“系统挂起”提示 === */}
            {/* 延时 0.8s 出现（即在关机动画结束后出现），一直闪烁直到跳转 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }} 
              className="z-30 text-center font-mono"
            >
              <div className="text-red-500 text-sm tracking-[0.3em] mb-2">
                SYSTEM_HALTED
              </div>
              <div className="text-[10px] text-gray-600 animate-pulse">
                WAITING_FOR_REBOOT_SEQUENCE_
              </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}