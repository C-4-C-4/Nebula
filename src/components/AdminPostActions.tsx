"use client";
import Link from "next/link";

export default function AdminPostActions({ slug, sha }: { slug: string, sha: string }) {
  
  const handleStageDelete = () => {
    // 触发自定义事件，通知 StagingManager
    const event = new CustomEvent("add-to-staging", {
      detail: {
        uiId: Math.random().toString(36).substr(2, 9),
        type: "DELETE_POST",
        desc: `DELETE FILE: ${slug}.md`,
        slug,
        sha
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="col-span-2 flex justify-end gap-2 items-center">
      <Link 
        href={`/admin/editor/${slug}`}
        className="text-[10px] border border-white/20 px-2 py-1 hover:bg-white hover:text-black transition-colors uppercase"
      >
        EDIT
      </Link>
      
      {/* 修改后的删除按钮：只暂存，不提交 */}
      <button 
        onClick={handleStageDelete}
        className="text-[10px] border border-red-900/50 text-red-700 px-2 py-1 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors uppercase"
      >
        DEL
      </button>
    </div>
  );
}