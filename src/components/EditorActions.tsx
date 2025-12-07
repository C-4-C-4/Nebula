"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditorActions({ 
  getFormData 
}: { 
  getFormData: () => any 
}) {
  const router = useRouter();

  const handleStage = () => {
    const data = getFormData();
    if(!data) return;

    // 触发暂存事件
    const event = new CustomEvent("add-to-staging", {
      detail: {
        uiId: Math.random().toString(36).substr(2, 9),
        type: "SAVE_POST",
        desc: `SAVE POST: ${data.title}`,
        slug: data.slug,
        content: data.fileContent,
        sha: data.sha || undefined
      }
    });
    window.dispatchEvent(event);
    
    // 跳转回列表
    router.push("/admin");
  };

  return (
    <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3">
       {/* 直接提交 (旧逻辑) */}
       <button type="submit" className="w-full bg-endfield-accent text-black font-bold py-3 hover:bg-white transition-colors uppercase tracking-widest text-sm">
          DIRECT UPLOAD (SLOW)
       </button>
       
       {/* 暂存按钮 (新逻辑) */}
       <button 
         type="button" 
         onClick={handleStage}
         className="w-full border border-endfield-accent text-endfield-accent font-bold py-3 hover:bg-endfield-accent/10 transition-colors uppercase tracking-widest text-sm"
       >
          + ADD TO BUFFER (FAST)
       </button>
       
       <Link href="/admin" className="w-full text-center py-2 text-xs text-gray-500 hover:text-white transition-colors border border-transparent hover:border-white/20 uppercase tracking-widest">
         [ABORT_OPERATION]
       </Link>
    </div>
  );
}