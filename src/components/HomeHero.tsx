"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import TechButton from "@/components/TechButton";
import ScrambleText from "@/components/ScrambleText";
import LoadingOverlay from "@/components/LoadingOverlay"; // 确保引入

// 动态导入 3D 核心
const HeroCore = dynamic(() => import("@/components/HeroCore"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] flex flex-col items-center justify-center bg-transparent">
      <div className="w-16 h-16 border-2 border-endfield-accent/30 border-t-endfield-accent rounded-full animate-spin mb-4" />
      <div className="text-endfield-accent font-mono text-xs animate-pulse tracking-widest">
        INITIALIZING_CORE...
      </div>
    </div>
  ),
});

// 归档页面的加载日志
const ARCHIVE_LOGS = [
  "REQUESTING_ACCESS: /ROOT/ARCHIVES",
  "AUTH_TOKEN: VERIFIED",
  "MOUNTING_VIRTUAL_DRIVE...",
  "SCANNING_FILE_INDEX...",
  "SORTING_BY_DATE: DESC",
  "BUILDING_DIRECTORY_TREE...",
  "INTERFACE_READY."
];

// 接受自定义标题 Props
export default function HomeHero({ 
  line1 = "SYSTEM", 
  line2 = "OVERRIDE" 
}: { 
  line1?: string; 
  line2?: string; 
}) {
  const router = useRouter();
  const [isArchiving, setIsArchiving] = useState(false);

  // 处理点击：触发动画 -> 跳转
  const handleArchiveClick = () => {
    setIsArchiving(true);
    setTimeout(() => {
      router.push("/archives");
    }, 1500); // 1.5秒动画时间
  };

  return (
    <>
      {/* 1. 加载全屏遮罩 */}
      <LoadingOverlay isLoading={isArchiving} customLogs={ARCHIVE_LOGS} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
        <div className="border-l-4 border-endfield-accent pl-8 py-4">
          <h1 className="text-7xl md:text-9xl font-bold uppercase tracking-tighter leading-[0.85] mb-6">
            {line1}<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-700">
              {line2}
            </span>
          </h1>
          
          <div className="flex gap-6 text-sm font-mono text-endfield-dim">
            <p>USER: ADMIN</p>
            <ScrambleText text="PROTOCOL: INITIATED" />
          </div>
          
          <div className="mt-8">
             {/* 2. 绑定点击事件，不再使用 Link 包裹，完全由 JS 控制跳转 */}
             <div className="inline-block cursor-pointer" onClick={handleArchiveClick}>
               <TechButton text="ACCESS_ARCHIVES" />
             </div>
          </div>
        </div>

        <div className="relative h-[400px] flex items-center justify-center">
          <HeroCore />
          <div className="absolute top-10 right-10 text-[10px] font-mono text-endfield-accent border border-endfield-accent px-2 py-1 bg-black/50 backdrop-blur-sm pointer-events-none">
            CORE_STATUS: STABLE
          </div>
          <div className="absolute bottom-20 left-10 flex flex-col gap-1 text-[10px] font-mono text-gray-500 pointer-events-none">
            <p>RPM: 4200</p>
            <p>TEMP: 340K</p>
          </div>
        </div>
      </div>
    </>
  );
}