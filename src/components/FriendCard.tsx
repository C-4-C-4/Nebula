"use client";
import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";

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

const getIconSlug = (name: string) => {
  const lowerName = name.toLowerCase().trim();
  const map: Record<string, string> = {
    "next.js": "nextdotjs",
    "nextjs": "nextdotjs",
    "vue": "vuedotjs",
    "vue.js": "vuedotjs",
    "nuxt": "nuxtdotjs",
    "nuxt.js": "nuxtdotjs",
    "react": "react",
    "three.js": "threedotjs",
    "threejs": "threedotjs",
    "tailwind": "tailwindcss",
    "tailwindcss": "tailwindcss",
    "c#": "csharp",
    "c++": "cplusplus",
    ".net": "dotnet",
    "webgl": "webgl",
    "gsap": "greensock"
  };
  if (map[lowerName]) return map[lowerName];
  return lowerName.replace(/\./g, "dot").replace(/[^a-z0-9]/g, "");
};

// 技术标签组件
const TechTag = ({ tech }: { tech: string }) => {
  const [isError, setIsError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const iconSlug = getIconSlug(tech);
  const iconUrl = `https://cdn.simpleicons.org/${iconSlug}/9ca3af`;

  return (
    <div className="flex items-center gap-1.5 border border-white/10 px-2 py-1 bg-white/5 hover:bg-white/10 hover:border-endfield-accent/50 transition-colors group/tag h-6">
      {!isError && (
        <img 
          src={iconUrl} 
          alt="" 
          className={`w-3 h-3 opacity-70 group-hover/tag:opacity-100 transition-opacity ${isLoaded ? '' : 'hidden'}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsError(true)} 
        />
      )}
      <span className="text-[9px] font-mono text-endfield-dim uppercase tracking-wider group-hover/tag:text-white transition-colors leading-none">
        {tech}
      </span>
    </div>
  );
};

export default function FriendCard({ data, index }: { data: Friend; index: number }) {
  const FALLBACK_IMAGE = "https://placehold.co/600x340/09090b/333/png?text=NO_SIGNAL";

  // === 1. Logo 逻辑 ===
  const placeholderLogo = `https://placehold.co/128x128/000/FFF?text=${data.siteName.charAt(0)}`;
  const [logoSrc, setLogoSrc] = useState<string>(
    (data.logo && data.logo.trim() !== "") ? data.logo : placeholderLogo
  );
  const [logoAttempt, setLogoAttempt] = useState(0);
  const [isUsingCache, setIsUsingCache] = useState(false);

  useEffect(() => {
    if (data.logo && data.logo.trim() !== "") return;
    const cacheKey = `favicon_url_${data.url}`;
    const cachedUrl = localStorage.getItem(cacheKey);
    if (cachedUrl) {
      setLogoSrc(cachedUrl);
      setIsUsingCache(true);
      return;
    }
    try {
      const domain = new URL(data.url).hostname;
      const providers = [
        `https://api.iowen.cn/favicon/${domain}.png`,
        `https://api.uomg.com/api/get.favicon?url=${data.url}`,
        `https://favicon.im/${domain}`,
        placeholderLogo
      ];
      if (logoAttempt < providers.length) setLogoSrc(providers[logoAttempt]);
    } catch {}
  }, [data.url, data.logo, logoAttempt, placeholderLogo]);

  const handleLogoError = () => {
    if (isUsingCache) {
      localStorage.removeItem(`favicon_url_${data.url}`);
      setIsUsingCache(false);
      setLogoAttempt(0);
      return;
    }
    if (logoAttempt < 3) setLogoAttempt(prev => prev + 1);
  };

  const handleLogoLoad = () => {
    if ((data.logo && data.logo.trim() !== "") || logoSrc === placeholderLogo) return;
    localStorage.setItem(`favicon_url_${data.url}`, logoSrc);
  };

  // === 2. 快照逻辑 ===
  const autoSnapshotUrl = useMemo(() => {
    if (data.snapshot && data.snapshot.trim() !== "") return data.snapshot;
    
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
  }, [data.url, data.snapshot]);

  const [imgSrc, setImgSrc] = useState(
    (data.snapshot && data.snapshot.trim() !== "") ? data.snapshot : autoSnapshotUrl
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (data.snapshot && data.snapshot.trim() !== "") {
      setIsLoading(false);
      return;
    }
    const isCached = localStorage.getItem(`snap_cached_${autoSnapshotUrl}`);
    if (isCached === "true") setIsLoading(false);
  }, [autoSnapshotUrl, data.snapshot]);

  const handleSnapshotLoad = () => {
    setIsLoading(false);
    if (!data.snapshot) {
      localStorage.setItem(`snap_cached_${autoSnapshotUrl}`, "true");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-endfield-surface border border-white/10 hover:border-endfield-accent transition-colors duration-300 flex flex-col h-full"
    >
      {/* 快照区域 */}
      <div className="relative h-40 w-full overflow-hidden border-b border-white/10 bg-black">
        {/* 扫描线动画 */}
        <div className="data-scan-overlay" />
        
        {/* 
           === 关键修复 ===
           移除了所有的遮罩层 div (bg-black/20 等)。
           现在这里只剩下图片本身和上面的扫描线。
           这样鼠标移上去就不会有变亮的效果了。
        */}
        
        <img 
          src={imgSrc} 
          alt={data.siteName} 
          onLoad={handleSnapshotLoad}
          onError={() => {
            setImgSrc(FALLBACK_IMAGE);
            setIsLoading(false);
          }}
          // 图片保持原样，仅保留缩放动画
          className={`w-full h-full object-cover transform group-hover:scale-105 transition-all duration-500 ${isLoading ? 'blur-sm scale-110' : 'blur-0 scale-100'}`}
        />

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
             <div className="text-[10px] font-mono text-endfield-dim animate-pulse">
               FETCHING_SNAPSHOT...
             </div>
          </div>
        )}

        <div className="absolute top-2 left-2 z-20 text-[9px] font-mono text-endfield-accent bg-black/80 px-1 border border-endfield-accent/30">
          {data.id}
        </div>
      </div>

      {/* 信息区域 */}
      <div className="p-5 flex-1 flex flex-col relative">
        <div className="absolute -top-6 right-4 w-12 h-12 bg-[#09090b] border border-white/20 p-1 group-hover:border-endfield-accent transition-colors z-20 shadow-lg">
           <img 
             src={logoSrc} 
             alt="logo" 
             className="w-full h-full object-contain rounded-sm" 
             onError={handleLogoError} 
             onLoad={handleLogoLoad}
           />
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

        {data.stack && data.stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
             {data.stack.map((tech) => (
               <TechTag key={tech} tech={tech} />
             ))}
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