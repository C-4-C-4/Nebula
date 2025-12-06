"use client";
import { useState } from "react";
import FriendCard from "@/components/FriendCard";
import { motion, AnimatePresence } from "framer-motion";

interface Friend {
  id: string;
  blogger: string;
  siteName: string;
  logo?: string;
  snapshot?: string;
  email: string;
  description: string;
  url: string;
  stack?: string[];
}

export default function FriendsList({ initialFriends }: { initialFriends: Friend[] }) {
  const [query, setQuery] = useState("");

  // 核心过滤逻辑
  const filteredFriends = initialFriends.filter((friend) => {
    const q = query.toLowerCase();
    return (
      friend.siteName.toLowerCase().includes(q) || // 搜站点名
      friend.blogger.toLowerCase().includes(q) ||  // 搜博主
      friend.url.toLowerCase().includes(q) ||      // 搜域名
      friend.email.toLowerCase().includes(q)       // 搜邮箱
    );
  });

  return (
    <div className="space-y-8">
      {/* === 搜索控制器 === */}
      <div className="w-full max-w-lg mx-auto">
        <div className="relative group">
          {/* 装饰：背景光晕 */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-endfield-accent/50 to-white/20 opacity-0 group-hover:opacity-100 transition duration-500 blur-sm rounded-sm"></div>
          
          <div className="relative flex items-center bg-black border border-white/20 group-hover:border-endfield-accent/50 transition-colors p-1">
            {/* 图标 */}
            <div className="pl-3 pr-3 text-endfield-accent animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            
            {/* 输入框 */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH_DATABASE // NAME, URL, ID..."
              className="w-full bg-transparent border-none outline-none text-white font-mono text-xs h-10 placeholder-gray-600 focus:placeholder-white transition-colors uppercase"
            />
            
            {/* 清除按钮 */}
            {query && (
              <button onClick={() => setQuery("")} className="px-3 text-gray-500 hover:text-white transition-colors">
                ✕
              </button>
            )}
          </div>

          {/* 装饰：四角 */}
          <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-white/50" />
          <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-white/50" />
          <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-white/50" />
          <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-white/50" />
        </div>
      </div>

      {/* === 状态栏 === */}
      <div className="flex justify-between items-end border-b border-white/10 pb-2 mb-4">
         <div className="flex items-center gap-2 text-xs font-mono text-endfield-accent">
           <span className="w-2 h-2 bg-endfield-accent" />
           RESULT: {filteredFriends.length} / {initialFriends.length} UNITS
         </div>
         <div className="text-[10px] text-gray-600 font-mono">
           FILTER_STATUS: {query ? "ACTIVE" : "IDLE"}
         </div>
      </div>

      {/* === 列表展示 === */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <AnimatePresence mode="popLayout">
           {filteredFriends.map((friend, idx) => (
             <motion.div
               key={friend.id}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               transition={{ duration: 0.2 }}
               layout // 启用布局动画，让卡片平滑移动
             >
               <FriendCard data={friend} index={idx} />
             </motion.div>
           ))}
         </AnimatePresence>
      </motion.div>

      {/* 空状态提示 */}
      {filteredFriends.length === 0 && (
        <div className="py-24 text-center border border-dashed border-white/10 bg-white/5">
          <p className="text-gray-500 font-mono text-sm mb-2">NO_MATCHING_DATA_FOUND</p>
          <p className="text-[10px] text-gray-700">TRY_DIFFERENT_KEYWORDS</p>
          <button 
            onClick={() => setQuery("")}
            className="mt-6 text-xs border border-endfield-accent/30 text-endfield-accent px-4 py-2 hover:bg-endfield-accent hover:text-black transition-colors"
          >
            RESET_FILTER
          </button>
        </div>
      )}
    </div>
  );
}