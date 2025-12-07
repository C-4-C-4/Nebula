"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { batchCommitAction, StagingOperation } from "@/app/actions/batch";
import { useRouter } from "next/navigation";

// 定义暂存项结构
type StagedItem = StagingOperation & { uiId: string; desc: string };

export default function StagingManager() {
  const [items, setItems] = useState<StagedItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const router = useRouter();

  // 1. 初始化读取本地缓存
  useEffect(() => {
    const saved = localStorage.getItem("nebula_staging_buffer");
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch {}
    }

    // 监听自定义事件 "add-to-staging"
    const handleAdd = (e: CustomEvent<StagedItem>) => {
      setItems((prev) => {
        const newItem = e.detail;

        // === 修复核心：去重逻辑 ===
        // 过滤掉针对同一目标的老操作，只保留最新的
        const filtered = prev.filter(item => {
          
          // A. 如果新旧操作都是针对文章 (DELETE_POST 或 SAVE_POST)
          if (
            (item.type === 'DELETE_POST' || item.type === 'SAVE_POST') &&
            (newItem.type === 'DELETE_POST' || newItem.type === 'SAVE_POST')
          ) {
            // 如果 slug (文件名) 相同，则移除旧的
            return (item as any).slug !== (newItem as any).slug;
          }

          // B. 如果新旧操作都是针对数据文件 (SAVE_DATA)
          if (item.type === 'SAVE_DATA' && newItem.type === 'SAVE_DATA') {
            // 如果 filename 相同，则移除旧的
            return (item as any).filename !== (newItem as any).filename;
          }

          // 其他情况保留
          return true;
        });

        // 添加新操作
        const next = [...filtered, newItem];
        
        localStorage.setItem("nebula_staging_buffer", JSON.stringify(next));
        return next;
      });
      
      setIsOpen(true); // 自动展开提示
    };

    window.addEventListener("add-to-staging" as any, handleAdd);
    return () => window.removeEventListener("add-to-staging" as any, handleAdd);
  }, []);

  // 2. 撤回操作
  const handleRemove = (uiId: string) => {
    const next = items.filter(i => i.uiId !== uiId);
    setItems(next);
    localStorage.setItem("nebula_staging_buffer", JSON.stringify(next));
  };

  // 3. 一键发布
  const handleCommit = async () => {
    if (items.length === 0) return;
    setIsCommitting(true);
    
    // 转换数据结构，去掉前端用的 uiId 和 desc
    const ops = items.map(({ uiId, desc, ...rest }) => rest);
    
    await batchCommitAction(ops);

    // 清空
    setItems([]);
    localStorage.removeItem("nebula_staging_buffer");
    setIsCommitting(false);
    setIsOpen(false);
    router.refresh(); // 刷新页面数据
  };

  if (items.length === 0) return null;

  return (
    <>
      {/* 底部悬浮条 */}
      <div className="fixed bottom-0 left-0 w-full z-50 px-4 pb-4 pointer-events-none flex justify-center">
        <div className="pointer-events-auto w-full max-w-3xl bg-[#111] border border-endfield-accent shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
          
          {/* 标题栏 */}
          <div 
            className="bg-endfield-accent text-black px-4 py-2 flex justify-between items-center cursor-pointer select-none"
            onClick={() => setIsOpen(!isOpen)}
          >
             <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                <div className="w-2 h-2 bg-black animate-pulse" />
                BUFFER_ZONE // PENDING_CHANGES: {items.length}
             </div>
             <div className="text-[10px] font-mono">{isOpen ? "▼ COLLAPSE" : "▲ EXPAND"}</div>
          </div>

          {/* 列表区域 */}
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ height: 0 }} 
                animate={{ height: "auto" }} 
                exit={{ height: 0 }}
                className="bg-black/90 backdrop-blur-md"
              >
                <div className="max-h-60 overflow-y-auto p-2 space-y-1 scrollbar-hide">
                   {items.map((item) => (
                     <div key={item.uiId} className="flex items-center justify-between bg-white/5 p-2 border-l-2 border-gray-600 hover:border-endfield-accent transition-colors group">
                        <div className="flex items-center gap-3 overflow-hidden">
                           <span className={`text-[9px] px-1 font-bold ${item.type.includes('DELETE') ? 'bg-red-900 text-red-200' : 'bg-blue-900 text-blue-200'}`}>
                             {item.type.split('_')[0]}
                           </span>
                           <span className="text-xs font-mono text-gray-300 truncate">{item.desc}</span>
                        </div>
                        <button 
                          onClick={() => handleRemove(item.uiId)}
                          className="text-[10px] text-gray-500 hover:text-red-500 px-2 uppercase"
                        >
                          [REVERT]
                        </button>
                     </div>
                   ))}
                </div>

                {/* 提交按钮 */}
                <div className="p-2 border-t border-white/10">
                   <button 
                     onClick={handleCommit}
                     disabled={isCommitting}
                     className="w-full bg-white/10 hover:bg-endfield-accent hover:text-black text-white text-xs font-bold py-3 transition-colors uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                   >
                     {isCommitting ? (
                       <><span>PROCESSING...</span><span className="animate-spin">/</span></>
                     ) : (
                       `>>> PUSH_TO_CLOUD (${items.length})`
                     )}
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </>
  );
}