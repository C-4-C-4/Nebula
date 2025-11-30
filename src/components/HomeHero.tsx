"use client"; // 这一行至关重要，标记为客户端组件
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import TechButton from "@/components/TechButton";
import ScrambleText from "@/components/ScrambleText";

// 动态导入 3D 核心，解决闪烁问题
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

export default function HomeHero() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
      <div className="border-l-4 border-endfield-accent pl-8 py-4">
        <h1 className="text-7xl md:text-9xl font-bold uppercase tracking-tighter leading-[0.85] mb-6">
          System<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-700">Override</span>
        </h1>
        
        <div className="flex gap-6 text-sm font-mono text-endfield-dim">
          <p>USER: ADMIN</p>
          <ScrambleText text="PROTOCOL: INITIATED" />
        </div>
        
        <div className="mt-8">
           <TechButton text="INITIATE_SCAN" />
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
  );
}