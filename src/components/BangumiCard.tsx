"use client";
import { motion } from "framer-motion";
import { BangumiItem } from "@/lib/bilibili";

export default function BangumiCard({ data, index }: { data: BangumiItem; index: number }) {
  return (
    <motion.a
      href={data.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="group relative flex flex-col bg-endfield-surface border border-white/10 hover:border-endfield-accent h-full overflow-hidden"
    >
      {/* 封面图区域 */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
        <div className="data-scan-overlay z-20 pointer-events-none" />
        
        {/* 关键：使用 img 标签并禁用 referrer */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={data.cover} 
          alt={data.title}
          referrerPolicy="no-referrer" // === 核心：解决403问题 ===
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />

        {/* 状态角标 */}
        <div className={`absolute top-2 left-2 px-2 py-1 text-[10px] font-bold font-mono border ${
          data.is_finish 
            ? 'bg-black/80 text-gray-400 border-gray-600' 
            : 'bg-endfield-accent text-black border-endfield-accent'
        }`}>
          {data.is_finish ? "COMPLETED" : "ON_AIR"}
        </div>

        {/* 进度条装饰 */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
           <div className="h-full bg-endfield-accent w-2/3 group-hover:w-full transition-all duration-500" />
        </div>
      </div>

      {/* 信息区域 */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-black/40 backdrop-blur-sm">
        <div>
          <h3 className="text-sm font-bold text-white mb-1 line-clamp-1 group-hover:text-endfield-accent transition-colors">
            {data.title}
          </h3>
          <p className="text-[10px] text-endfield-dim font-mono mb-3">
            EP: {data.new_ep.index_show}
          </p>
        </div>
        
        <div className="text-[9px] text-gray-600 font-mono border-t border-white/10 pt-2 flex justify-between items-center">
           <span>SID: {data.season_id}</span>
           <span className="group-hover:translate-x-1 transition-transform">&gt; WATCH</span>
        </div>
      </div>
    </motion.a>
  );
}