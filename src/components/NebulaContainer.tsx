"use client"; // 关键：标记为客户端组件
import dynamic from "next/dynamic";

// 这里的动态导入逻辑完全移过来
const NebulaScene = dynamic(() => import("@/components/NebulaScene"), {
  ssr: false, // 在客户端组件里使用 ssr: false 是合法的
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black z-50">
      <div className="w-16 h-16 border-2 border-endfield-accent/30 border-t-endfield-accent rounded-full animate-spin mb-4" />
      <div className="text-endfield-accent font-mono text-xs animate-pulse tracking-widest">
        INITIALIZING_STAR_CHART...
      </div>
    </div>
  ),
});

// 重新定义一下 Props 类型，或者直接传 props
export default function NebulaContainer({ nodes }: { nodes: any[] }) {
  return <NebulaScene nodes={nodes} />;
}