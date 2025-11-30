"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  date: string;
  category: string;
}

interface ArchiveData {
  [year: string]: Post[];
}

export default function ArchiveTerminal({ archives }: { archives: ArchiveData }) {
  // 当前选中的年份，null 表示在根目录
  const [currentYear, setCurrentYear] = useState<string | null>(null);

  // 获取年份列表（倒序）
  const years = Object.keys(archives).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="w-full bg-black/50 border border-white/20 backdrop-blur-md min-h-[60vh] flex flex-col">
      
      {/* 顶部地址栏 */}
      <div className="bg-white/5 border-b border-white/10 p-3 flex items-center gap-2 font-mono text-sm">
         <div className="w-3 h-3 rounded-full bg-red-500/50" />
         <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
         <div className="w-3 h-3 rounded-full bg-green-500/50" />
         <div className="ml-4 text-gray-400">root/archives{currentYear ? `/${currentYear}` : ''}</div>
      </div>

      {/* 内容区域 */}
      <div className="p-8 flex-1">
        <AnimatePresence mode="wait">
          
          {/* === 视图 1: 根目录 (显示年份文件夹) === */}
          {!currentYear && (
            <motion.div 
              key="folders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
            >
              {years.map(year => (
                <div 
                  key={year}
                  onClick={() => setCurrentYear(year)}
                  className="group cursor-pointer flex flex-col items-center gap-2"
                >
                  {/* 文件夹图标 (纯CSS画) */}
                  <div className="relative w-16 h-14 bg-white/10 group-hover:bg-endfield-accent group-hover:text-black transition-colors border border-white/20">
                     <div className="absolute -top-2 left-0 w-6 h-2 bg-white/10 border-t border-l border-r border-white/20 group-hover:bg-endfield-accent group-hover:border-endfield-accent transition-colors" />
                     <div className="absolute inset-0 flex items-center justify-center font-bold text-xs">
                        DIR
                     </div>
                  </div>
                  <span className="text-sm font-mono group-hover:text-endfield-accent transition-colors">{year}</span>
                  <span className="text-[10px] text-gray-500">{archives[year].length} FILES</span>
                </div>
              ))}
            </motion.div>
          )}

          {/* === 视图 2: 年份详情 (显示文件列表) === */}
          {currentYear && (
            <motion.div
              key="files"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
               <button 
                 onClick={() => setCurrentYear(null)}
                 className="mb-6 text-xs font-mono text-endfield-accent hover:text-white flex items-center gap-1"
               >
                 &lt; ../RETURN_TO_ROOT
               </button>

               <div className="space-y-1">
                  {/* 表头 */}
                  <div className="grid grid-cols-12 text-[10px] text-gray-500 pb-2 border-b border-white/10 uppercase mb-2 px-2">
                     <div className="col-span-2">Date</div>
                     <div className="col-span-1">Type</div>
                     <div className="col-span-7">Document Title</div>
                     <div className="col-span-2 text-right">Size</div>
                  </div>

                  {archives[currentYear].map((post, idx) => (
                    <Link 
                      href={`/blog/${post.id}`} 
                      key={post.id}
                      className="grid grid-cols-12 items-center p-2 text-sm font-mono text-gray-300 hover:bg-endfield-accent hover:text-black transition-colors cursor-pointer border-l-2 border-transparent hover:border-black"
                    >
                       <div className="col-span-2 text-xs opacity-70">{post.date}</div>
                       <div className="col-span-1 text-[10px] border border-current px-1 w-fit">{post.category}</div>
                       <div className="col-span-7 font-bold truncate pr-4">{post.title}</div>
                       <div className="col-span-2 text-right text-xs opacity-70">
                         {Math.floor(Math.random() * 50 + 10)}KB
                       </div>
                    </Link>
                  ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}