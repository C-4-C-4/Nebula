"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  filename: string;
  sha: string;
  children: React.ReactNode;
  transformData?: (formData: FormData) => any;
}

export default function AdminDataForm({ filename, sha, children, transformData }: Props) {
  const router = useRouter();

  const handleStage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    let jsonData: any = {};
    
    if (transformData) {
      jsonData = transformData(formData);
    } else {
      formData.forEach((value, key) => {
        if (key === 'sha') return;
        if (key === 'stack' && typeof value === 'string') {
          jsonData[key] = value.split(',').map(s => s.trim()).filter(s => s);
        } else if (key.includes('.')) {
          const [parent, child] = key.split('.');
          if (!jsonData[parent]) jsonData[parent] = {};
          jsonData[parent][child] = value;
        } else {
          jsonData[key] = value;
        }
      });
    }

    const newItem = {
      uiId: Math.random().toString(36).substr(2, 9),
      type: "SAVE_DATA",
      desc: `UPDATE FILE: ${filename}`,
      filename: filename,
      data: jsonData,
      sha: sha
    };

    // === 关键修复：直接手动写入 LocalStorage 作为双重保险 ===
    try {
      const saved = localStorage.getItem("nebula_staging_buffer");
      const prevItems = saved ? JSON.parse(saved) : [];
      // 简单的去重逻辑
      const filtered = prevItems.filter((item: any) => 
        !(item.type === 'SAVE_DATA' && item.filename === filename)
      );
      const nextItems = [...filtered, newItem];
      localStorage.setItem("nebula_staging_buffer", JSON.stringify(nextItems));
    } catch (err) {
      console.error("Storage Error", err);
    }

    // 触发事件通知 UI 更新 (如果 StagingManager 存在的话)
    // @ts-ignore
    const event = new CustomEvent("add-to-staging", { detail: newItem });
    window.dispatchEvent(event);
    
    router.push("/admin");
  };

  return (
    <form onSubmit={handleStage} className="space-y-6">
      {children}
      <div className="flex gap-4 mt-8">
         <button type="submit" className="flex-1 bg-endfield-accent text-black font-bold py-3 hover:bg-white transition-colors uppercase">
           + ADD TO BUFFER (SAVE)
         </button>
         <Link href="/admin" className="px-6 py-3 border border-white/20 text-gray-400 hover:text-white text-center flex items-center justify-center transition-colors uppercase">
           CANCEL
         </Link>
      </div>
    </form>
  );
}