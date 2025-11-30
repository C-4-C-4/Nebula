"use client";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";

interface Friend {
  id: string;
  blogger: string;
  siteName: string;
  logo: string;
  email: string;
  description: string;
  url: string;
  stack?: string[];
}

// 辅助函数：将技术名称转换为 Simple Icons 的 Slug 格式
// 例如: "Next.js" -> "nextdotjs", "C#" -> "csharp"
const getIconSlug = (name: string) => {
  const lowerName = name.toLowerCase();
  // 特殊映射表 (处理特殊符号)
  const map: Record<string, string> = {
    "next.js": "nextdotjs",
    "vue.js": "vuedotjs",
    "three.js": "threedotjs",
    "nuat.js": "nuxtdotjs",
    "c#": "csharp",
    "c++": "cplusplus",
    ".net": "dotnet"
  };
  
  if (map[lowerName]) return map[lowerName];
  
  // 默认规则：替换 . 为 dot，然后移除其他非字母数字字符
  return lowerName.replace(/\./g, "dot").replace(/[^a-z0-9]/g, "");
};

export default function FriendCard({ data, index }: { data: Friend; index: number }) {
  const FALLBACK_IMAGE = "https://placehold.co/600x340/09090b/333/png?text=NO_SIGNAL";

  const snapshotUrl = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const params = new URLSearchParams({
      url: data.url,
      screenshot: "true",
      meta: "false",
      embed: "screenshot.url",
      viewport: "1280x800",
      nrg: "1",
      ttl: "86400000",
      v: today
    });
    return `https://api.microlink.io/?${params.toString()}`;
  }, [data.url]);

  const [imgSrc, setImgSrc] = useState(snapshotUrl);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-endfield-surface border border-white/10 hover:border-endfield-accent transition-colors duration-300 flex flex-col h-full"
    >
      {/* 1. 快照区域 */}
      <div className="relative h-40 w-full overflow-hidden border-b border-white/10 bg-black">
        <div className="data-scan-overlay" />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
        
        <img 
          src={imgSrc} 
          alt={data.siteName} 
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImgSrc(FALLBACK_IMAGE);
            setIsLoading(false);
          }}
          className={`w-full h-full object-cover transform group-hover:scale-105 transition-all duration-500 ${isLoading ? 'blur-sm scale-110' : 'blur-0 scale-100'}`}
        />

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-0">
             <div className="text-[10px] font-mono text-endfield-dim animate-pulse">
               FETCHING_SNAPSHOT...
             </div>
          </div>
        )}

        <div className="absolute top-2 left-2 z-20 text-[9px] font-mono text-endfield-accent bg-black/80 px-1 border border-endfield-accent/30">
          {data.id}
        </div>
      </div>

      {/* 2. 信息区域 */}
      <div className="p-5 flex-1 flex flex-col relative">
        <div className="absolute -top-6 right-4 w-12 h-12 bg-black border border-white/20 p-1 group-hover:border-endfield-accent transition-colors z-20">
           <img src={data.logo} alt="logo" className="w-full h-full object-contain" />
        </div>

        <div className="mb-3 pr-10">
           <h3 className="text-lg font-bold text-white group-hover:text-endfield-accent transition-colors truncate">
             {data.siteName}
           </h3>
           <div className="flex items-center gap-2 text-xs text-gray-400 font-mono mt-1">
             <span className="w-1 h-1 bg-endfield-dim" />
             <span>OP: {data.blogger}</span>
           </div>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3 font-mono h-10">
          {data.description}
        </p>

        {/* === 新增：技术栈展示区域 (带图标) === */}
        {data.stack && data.stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
             {data.stack.map((tech) => {
               const iconSlug = getIconSlug(tech);
               // 图标颜色设置为灰色 (9ca3af)，你可以改成 white
               const iconUrl = `https://cdn.simpleicons.org/${iconSlug}/9ca3af`; 
               
               return (
                 <div 
                   key={tech} 
                   className="flex items-center gap-1.5 border border-white/10 px-2 py-1 bg-white/5 hover:bg-white/10 hover:border-endfield-accent/50 transition-colors group/tag"
                 >
                   {/* 图标 */}
                   <img 
                     src={iconUrl} 
                     alt="" 
                     className="w-3 h-3 opacity-70 group-hover/tag:opacity-100 transition-opacity"
                     onError={(e) => {
                       // 如果图标加载失败（比如找不到这个技术），就隐藏 img 标签
                       (e.target as HTMLImageElement).style.display = 'none';
                     }}
                   />
                   
                   {/* 文字 */}
                   <span className="text-[9px] font-mono text-endfield-dim uppercase tracking-wider group-hover/tag:text-white transition-colors">
                     {tech}
                   </span>
                 </div>
               );
             })}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
           <a href={`mailto:${data.email}`} className="text-[10px] text-gray-600 hover:text-white transition-colors flex items-center gap-1 font-mono">
             [@] CONTACT
           </a>

           <a 
             href={data.url} 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-xs font-bold text-endfield-accent hover:bg-endfield-accent hover:text-black px-3 py-1 border border-endfield-accent/30 transition-all flex items-center gap-1"
           >
             VISIT <span className="text-[8px]">&gt;</span>
           </a>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-endfield-accent transition-colors" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-endfield-accent transition-colors" />
    </motion.div>
  );
}