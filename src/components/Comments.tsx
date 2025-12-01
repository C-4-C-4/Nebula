"use client";
import Giscus from "@giscus/react";

interface GiscusConfig {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
}

export default function Comments({ config }: { config: GiscusConfig }) {
  // 如果配置不完整，不显示评论区
  if (!config?.repo || !config?.repoId) return null;

  return (
    <div className="w-full mt-16 pt-10 border-t border-white/10">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-2 h-6 bg-endfield-accent" />
        <h2 className="text-xl font-bold font-mono text-white">
          // COMMS_CHANNEL
        </h2>
      </div>
      
      <div className="bg-black/30 p-4 md:p-8 border border-white/5">
        <Giscus
          id="comments"
          repo={config.repo as any}
          repoId={config.repoId}
          category={config.category}
          categoryId={config.categoryId}
          mapping="pathname" // 根据路径自动区分文章/页面
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme="transparent_dark" // 透明深色主题，完美融入背景
          lang="zh-CN"
          loading="lazy"
        />
      </div>
    </div>
  );
}