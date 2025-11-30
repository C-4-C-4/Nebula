"use client";
import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";

interface Friend {
  id: string;
  blogger: string;
  siteName: string;
  logo?: string;
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

const TechTag = ({ tech }: { tech: string }) => {
  const [isError, setIsError] = useState(false);
  const iconSlug = getIconSlug(tech);
  const iconUrl = `https://cdn.simpleicons.org/${iconSlug}/9ca3af`;

  return (
    <div className="flex items-center gap-1.5 border border-white/10 px-2 py-1 bg-white/5 hover:bg-white/10 hover:border-endfield-accent/50 transition-colors group/tag h-6">
      {!isError && (
        <img 
          src={iconUrl} 
          alt="" 
          className="w-3 h-3 opacity-70 group-hover/tag:opacity-100 transition-opacity"
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

  // === Logo 逻辑开始 ===
  
  // 1. 计算兜底的首字母占位图
  const placeholderLogo = `https://placehold.co/128x128/000/FFF?text=${data.siteName.charAt(0)}`;
  
  // 2. 初始化状态
  // 为了避免服务端水合错误，初始值先给 placeholder 或 manual config
  // 真实的缓存读取放在 useEffect 里
  const [logoSrc, setLogoSrc] = useState<string>(
    (data.logo && data.logo.trim() !== "") ? data.logo : placeholderLogo
  );
  
  const [logoAttempt, setLogoAttempt] = useState(0);
  const [isUsingCache, setIsUsingCache] = useState(false); // 标记是否正在使用缓存

  const getDomain = (url: string) => {
    try { return new URL(url).hostname; } catch { return ""; }
  };

  // 3. 核心逻辑：加载 Logo
  useEffect(() => {
    // A. 如果有手动配置，直接结束
    if (data.logo && data.logo.trim() !== "") return;

    // B. 尝试读取本地缓存
    const cacheKey = `favicon_url_${data.url}`;
    const cachedUrl = localStorage.getItem(cacheKey);

    if (cachedUrl) {
      setLogoSrc(cachedUrl);
      setIsUsingCache(true); // 标记命中缓存，不再进行 API 轮询
      return;
    }

    // C. 如果没有缓存，开始 API 轮询逻辑
    const domain = getDomain(data.url);
    if (!domain) return;

    const providers = [
      `https://api.iowen.cn/favicon/${domain}.png`,
      `https://api.uomg.com/api/get.favicon?url=${data.url}`,
      `https://favicon.im/${domain}`,
      placeholderLogo
    ];

    if (logoAttempt < providers.length) {
       setLogoSrc(providers[logoAttempt]);
    }
  }, [data.url, data.logo, logoAttempt, placeholderLogo]);

  // 4. 错误处理
  const handleLogoError = () => {
    // 如果当前正在使用缓存的 URL 报错了（比如缓存的图片过期了），则清除缓存，并从头开始尝试
    if (isUsingCache) {
      localStorage.removeItem(`favicon_url_${data.url}`);
      setIsUsingCache(false);
      setLogoAttempt(0); // 重置尝试次数
      return;
    }

    // 正常轮询失败，尝试下一个
    if (logoAttempt < 3) {
      setLogoAttempt(prev => prev + 1);
    }
  };

  // 5. 成功处理：缓存有效的 URL
  const handleLogoLoad = () => {
    // 如果是手动配置的或者是默认占位图，不缓存
    if ((data.logo && data.logo.trim() !== "") || logoSrc === placeholderLogo) return;
    
    // 缓存当前成功的 URL
    localStorage.setItem(`favicon_url_${data.url}`, logoSrc);
  };
  // === Logo 逻辑结束 ===


  // === 快照逻辑 (保持不变) ===
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

  useEffect(() => {
    const isCached = localStorage.getItem(`snap_cached_${snapshotUrl}`);
    if (isCached === "true") setIsLoading(false);
  }, [snapshotUrl]);

  const handleSnapshotLoad = () => {
    setIsLoading(false);
    localStorage.setItem(`snap_cached_${snapshotUrl}`, "true");
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
        <div className="data-scan-overlay" />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
        
        <img 
          src={imgSrc} 
          alt={data.siteName} 
          onLoad={handleSnapshotLoad}
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

      {/* 信息区域 */}
      <div className="p-5 flex-1 flex flex-col relative">
        <div className="absolute -top-6 right-4 w-12 h-12 bg-[#09090b] border border-white/20 p-1 group-hover:border-endfield-accent transition-colors z-20 shadow-lg">
           {/* Logo 图片 */}
           <img 
             src={logoSrc} 
             alt="logo" 
             className="w-full h-full object-contain rounded-sm" 
             onError={handleLogoError} 
             onLoad={handleLogoLoad} // 绑定成功回调，写入缓存
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