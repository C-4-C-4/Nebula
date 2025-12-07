"use client"; 
import { useState } from "react";

const getIconSlug = (name: string) => {
  const lowerName = name.toLowerCase().trim();
  const map: Record<string, string> = {
    "next.js": "nextdotjs",
    "react": "react",
    "typescript": "typescript",
    "tailwindcss": "tailwindcss",
    "three.js": "threedotjs",
    "framer motion": "framer",
    "vercel": "vercel",
    "git": "git",
    "c#": "csharp",
    "vue": "vuedotjs",
    "nuxt": "nuxtdotjs"
  };
  
  if (map[lowerName]) return map[lowerName];
  return lowerName.replace(/\./g, "dot").replace(/[^a-z0-9]/g, "");
};

export default function TechModule({ tech }: { tech: string }) {
  const [isError, setIsError] = useState(false);
  const iconSlug = getIconSlug(tech);
  const iconUrl = `https://cdn.simpleicons.org/${iconSlug}/9ca3af`;

  return (
    // 使用 w-full 确保填满网格单元
    <div className="w-full group flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 hover:border-endfield-accent transition-colors">
      <div className="w-1 h-full bg-endfield-accent/50 group-hover:bg-endfield-accent transition-colors shrink-0" />
      
      {!isError && (
         <img 
           src={iconUrl} 
           alt="" 
           className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" // shrink-0 防止图标被挤压
           onError={() => setIsError(true)} 
         />
      )}
      
      {/* truncate: 如果文字太长，显示省略号，防止换行破坏布局 */}
      <span className="font-mono text-sm text-gray-400 group-hover:text-white uppercase tracking-wider truncate">
        {tech}
      </span>
    </div>
  );
}