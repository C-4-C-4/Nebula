"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  filename: string;
  sha: string;
  currentList: any[];
  idField?: string;
  children: React.ReactNode;
}

export default function AdminListForm({ filename, sha, currentList, idField = "id", children }: Props) {
  const router = useRouter();

  const handleStage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    let newItem: any = {};
    formData.forEach((value, key) => {
      if (key === 'sha') return;
      newItem[key] = value;
    });

    // === 关键修复开始：读取本地暂存区作为基准 ===
    let baseList = currentList; // 默认使用服务器数据

    try {
      const savedBuffer = localStorage.getItem("nebula_staging_buffer");
      if (savedBuffer) {
        const buffer = JSON.parse(savedBuffer);
        // 查找是否已经有针对当前文件的暂存操作
        const pendingOp = buffer.find((op: any) => 
          op.type === 'SAVE_DATA' && op.filename === filename
        );
        
        if (pendingOp && Array.isArray(pendingOp.data)) {
          // 如果有，使用暂存区的数据作为基准，实现"累加"
          baseList = pendingOp.data;
        }
      }
    } catch (err) {
      console.error("Failed to merge staging data", err);
    }
    // === 关键修复结束 ===

    // 接下来的逻辑基于 baseList 进行
    let newList = [...baseList];
    const existingIndex = newList.findIndex(item => item[idField] === newItem[idField]);

    let desc = "";

    if (existingIndex >= 0) {
      // 修改现有
      newList[existingIndex] = { ...newList[existingIndex], ...newItem };
      desc = `UPDATE ITEM: ${newItem[idField]} in ${filename}`; // 简化的描述
    } else {
      // 新增
      if (!newItem[idField]) {
         newItem[idField] = `${filename.split('.')[0].toUpperCase()}_${Math.floor(Date.now()/1000)}`;
      }
      // 新增到最前面
      newList = [newItem, ...newList];
      desc = `ADD ITEM: ${newItem[idField]} to ${filename}`;
    }

    const event = new CustomEvent("add-to-staging", {
      detail: {
        uiId: Math.random().toString(36).substr(2, 9),
        type: "SAVE_DATA",
        desc: desc,
        filename: filename,
        data: newList, // 这里发送的是累加后的完整数据
        sha: sha
      }
    });
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