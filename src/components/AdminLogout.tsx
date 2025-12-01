"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLogout({ onLogout }: { onLogout: () => Promise<void> }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // 1. 先调用服务端删除 Cookie
    await onLogout();

    // 2. 播放关机动画，然后强制刷新跳转
    setTimeout(() => {
      // 关键修改：使用 window.location.href 而不是 router.push
      // 这会触发浏览器级刷新，彻底清除 Next.js 的客户端路由缓存
      window.location.href = "/login";
    }, 2000);
  };

  return (
    // ... 下面的 JSX 保持不变 ...
    // ... 为了篇幅，请保留你现有的 JSX (包括那个 System Halted 的动画) ...
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
              animate={{ scaleY: [0, 0.02, 0.02, 0], scaleX: [1, 1, 0, 0], opacity: [0, 1, 1, 0] }}
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
              <div className="text-red-500 text-sm tracking-[0.3em] mb-2">SYSTEM_HALTED</div>
              <div className="text-[10px] text-gray-600 animate-pulse">WAITING_FOR_REBOOT_SEQUENCE_</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}