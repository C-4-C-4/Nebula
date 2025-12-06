"use client";
import { motion } from "framer-motion";

interface Project {
  id: number;
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
  updatedAt: string | null;
  homepage?: string | null;
  topics: string[];
}

const getLanguageColor = (lang: string) => {
  const colors: Record<string, string> = {
    TypeScript: "bg-blue-400",
    JavaScript: "bg-yellow-400",
    Python: "bg-green-400",
    Vue: "bg-emerald-400",
    HTML: "bg-orange-400",
    CSS: "bg-pink-400",
    Rust: "bg-red-400",
    Go: "bg-cyan-400",
  };
  return colors[lang] || "bg-gray-400";
};

export default function ProjectCard({ data, index }: { data: Project; index: number }) {
  // 计算活跃状态：3个月内有更新算 Active
  const lastUpdate = new Date(data.updatedAt || "");
  const isActive = (new Date().getTime() - lastUpdate.getTime()) < 90 * 24 * 60 * 60 * 1000;

  return (
    <motion.a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative flex flex-col bg-endfield-surface border border-white/10 hover:border-endfield-accent p-6 h-full transition-all duration-300 hover:bg-white/5"
    >
      {/* 顶部状态栏 */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getLanguageColor(data.language)} shadow-[0_0_8px_currentColor]`} />
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
            {data.language}
          </span>
        </div>
        
        <div className={`text-[9px] font-mono border px-1.5 py-0.5 ${isActive ? 'border-endfield-accent text-endfield-accent' : 'border-gray-600 text-gray-600'}`}>
          {isActive ? "STATUS: ACTIVE" : "STATUS: IDLE"}
        </div>
      </div>

      {/* 项目名称 */}
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-endfield-accent transition-colors truncate">
        {data.name}
      </h3>

      {/* 描述 */}
      <p className="text-xs text-gray-500 leading-relaxed mb-6 font-mono line-clamp-3 flex-grow">
        {data.description}
      </p>

      {/* 底部数据面板 */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-gray-400">
        <div className="flex gap-4">
          <div className="flex items-center gap-1 hover:text-white transition-colors">
            <span>★</span> {data.stars}
          </div>
          <div className="flex items-center gap-1 hover:text-white transition-colors">
            <span>⑂</span> {data.forks}
          </div>
        </div>
        
        <div className="group-hover:translate-x-1 transition-transform text-endfield-accent">
          ACCESS &gt;
        </div>
      </div>

      {/* 装饰性切角 */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/20 group-hover:border-endfield-accent transition-colors" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/20 group-hover:border-endfield-accent transition-colors" />
    </motion.a>
  );
}