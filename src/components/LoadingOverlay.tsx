"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const DEFAULT_LOGS = [
  "INITIALIZING_KERNEL...",
  "LOADING_MODULES: [OK]",
  "MOUNTING_VIRTUAL_FS...",
  "CHECKING_INTEGRITY...",
  "ESTABLISHING_SECURE_LINK...",
  "DECRYPTING_USER_DATA...",
  "ALLOCATING_MEMORY_BLOCKS...",
  "RENDER_ENGINE: ONLINE",
  "SYSTEM_READY."
];

export default function LoadingOverlay({ 
  isLoading, 
  customLogs 
}: { 
  isLoading: boolean; 
  customLogs?: string[] 
}) {
  const [logs, setLogs] = useState<string[]>([]);
  const targetLogs = customLogs || DEFAULT_LOGS;
  
  // 用于自动滚动到底部
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) {
      setLogs([]);
      let step = 0;
      // 加快速度，让滚动感更强
      const interval = setInterval(() => {
        if (step < targetLogs.length) {
          setLogs(prev => [...prev, targetLogs[step]]);
          step++;
        }
      }, 80); 
      return () => clearInterval(interval);
    }
  }, [isLoading, targetLogs]);

  // 每次日志更新，自动滚动到底部 (虽然 flex-end 已经辅助了，但这能确保万无一失)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }} // 退出时慢一点，有个淡出
          className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center font-mono"
        >
          {/* 背景装饰：向上扫描的激光线 */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
             <motion.div 
               initial={{ top: "100%" }}
               animate={{ top: "-10%" }}
               transition={{ duration: 2, ease: "linear", repeat: Infinity }}
               className="absolute w-full h-32 bg-gradient-to-t from-transparent via-endfield-accent/10 to-transparent w-full"
             />
          </div>

          <div className="relative z-10 w-full max-w-2xl px-6">
            
            {/* 顶部装饰条 */}
            <div className="flex justify-between items-end border-b border-endfield-accent/30 pb-2 mb-4">
               <div className="flex gap-2">
                 <div className="w-2 h-2 bg-endfield-accent animate-pulse" />
                 <span className="text-xs text-endfield-accent tracking-widest">SYSTEM_BOOT_SEQUENCE</span>
               </div>
               <div className="text-[10px] text-gray-500">MEM_CHECK: OK</div>
            </div>

            {/* 核心日志区：固定高度，内容底部对齐 */}
            <div className="h-64 w-full flex flex-col justify-end overflow-hidden mask-image-gradient">
              {/* 这里使用 flex-col 配合 justify-end 让文字沉底 */}
              <div className="flex flex-col justify-end min-h-0 space-y-1">
                 {logs.map((log, i) => (
                   <motion.div 
                     key={i}
                     // 关键动画：新文字从下面浮上来
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.2 }}
                     className="flex items-center gap-3 text-sm md:text-base"
                   >
                     {/* 每一行的行号装饰 */}
                     <span className="text-[10px] text-gray-600 w-8 text-right font-mono">
                       {(i + 1).toString().padStart(2, '0')}
                     </span>
                     {/* 日志内容 */}
                     <span className="text-endfield-accent font-bold tracking-wide">
                       &gt; {log}
                     </span>
                   </motion.div>
                 ))}
                 <div ref={bottomRef} />
              </div>
            </div>

            {/* 底部闪烁光标，模拟正在输入 */}
            <div className="mt-2 border-t border-endfield-accent/30 pt-2 flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <span className="text-xs text-gray-500">WAITING_FOR_RESPONSE</span>
                 <span className="w-2 h-4 bg-endfield-accent animate-blink" /> 
               </div>
               <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: targetLogs.length * 0.08, ease: "linear" }}
                    className="h-full bg-endfield-accent"
                  />
               </div>
            </div>

          </div>

          {/* 添加自定义 CSS 动画支持 blink */}
          <style jsx global>{`
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
            .animate-blink {
              animation: blink 1s step-end infinite;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}