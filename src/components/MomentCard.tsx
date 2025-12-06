"use client";
import { motion } from "framer-motion";
import { RssFeedItem } from "@/lib/rss";

export default function MomentCard({ data, index }: { data: RssFeedItem; index: number }) {
  return (
    <motion.a
      href={data.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group block bg-endfield-surface/80 border border-white/10 hover:border-endfield-accent transition-all duration-300 p-6 relative overflow-hidden"
    >
      {/* 装饰背景字 */}
      <div className="absolute top-2 right-2 text-[40px] font-bold text-white/5 font-mono select-none pointer-events-none">
        RSS
      </div>

      {/* 头部：来源信息 */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-10 h-10 border border-white/20 p-0.5 bg-black">
          <img src={data.sourceAvatar} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="text-sm font-bold text-white group-hover:text-endfield-accent transition-colors">
            {data.sourceName}
          </div>
          <div className="text-[10px] font-mono text-gray-500">
            SIGNAL_RECEIVED: {data.pubDate}
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-200 mb-2 line-clamp-1 group-hover:text-white transition-colors">
          {data.title}
        </h3>
        <p className="text-xs text-gray-500 font-mono leading-relaxed line-clamp-2">
          {data.snippet}
        </p>
      </div>

      {/* 底部装饰 */}
      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <div className="flex gap-1">
           <div className="w-1 h-1 bg-endfield-accent rounded-full animate-pulse" />
           <div className="w-1 h-1 bg-gray-600 rounded-full" />
           <div className="w-1 h-1 bg-gray-600 rounded-full" />
        </div>
        <div className="text-[10px] font-mono text-endfield-accent opacity-0 group-hover:opacity-100 transition-opacity">
          READ_SOURCE &gt;&gt;
        </div>
      </div>
      
      {/* 左侧光条 */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-endfield-accent scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
    </motion.a>
  );
}