"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLogout({ onLogout }: { onLogout: () => Promise<void> }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setTimeout(async () => {
      // 强制刷新跳转以清除缓存
      await onLogout();
      window.location.href = "/login";
    }, 2000);
  };

  return (
    <>
      <div className="mt-auto pt-6 border-t border-white/10">
         {/* === 优化后的登出按钮 === */}
         <button 
           onClick={handleLogout}
           disabled={isLoggingOut}
           className="relative w-full overflow-hidden border border-red-500/30 text-red-500 py-3 text-xs font-bold uppercase tracking-widest group disabled:opacity-50 disabled:cursor-not-allowed"
         >
           {/* 红色背景滑块 */}
           <div className="absolute inset-0 bg-red-600 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
           
           {/* 内容 */}
           <div className="relative z-10 flex justify-center items-center gap-2 group-hover:text-black transition-colors duration-300">
             <span className="w-2 h-2 bg-red-500 rounded-full group-hover:bg-black transition-colors" />
             [ DISCONNECT_SESSION ]
           </div>
         </button>
         
         <div className="text-center text-[9px] text-gray-600 mt-2">
           SECURE LOGOUT REQUIRED AFTER OPERATIONS
         </div>
      </div>

      {/* 关机动画保持不变 */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
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
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 1, 0], scale: 1.1 }}
              transition={{ duration: 0.8, times: [0, 0.2, 0.8, 1] }}
              className="text-red-600 font-mono text-4xl font-bold tracking-widest z-20 text-center absolute"
            >
              <div className="animate-pulse">CONNECTION_LOST</div>
            </motion.div>
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5, duration: 1 }}
               className="absolute inset-0 bg-[url('https://placehold.co/100x100/000000/222222/png?text=NO_SIGNAL')] bg-repeat opacity-20 mix-blend-overlay"
            />
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