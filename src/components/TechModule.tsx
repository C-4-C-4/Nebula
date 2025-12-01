"use client"; // 必须有这个，因为它用了 useState
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
    <div className="group flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 hover:border-endfield-accent transition-colors">
      <div className="w-1 h-full bg-endfield-accent/50 group-hover:bg-endfield-accent transition-colors" />
      
      {!isError && (
         <img 
           src={iconUrl} 
           alt="" 
           className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity"
           onError={() => setIsError(true)} 
         />
      )}
      
      <span className="font-mono text-sm text-gray-400 group-hover:text-white uppercase tracking-wider">
        {tech}
      </span>
    </div>
  );
}