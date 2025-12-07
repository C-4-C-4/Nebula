"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  filename: string;      // 例如 "songs.json"
  sha: string;
  currentList: any[];    // 当前的完整列表数据
  idField?: string;      // 主键字段名，默认 "id"
  children: React.ReactNode; // 表单内的输入框
}

export default function AdminListForm({ filename, sha, currentList, idField = "id", children }: Props) {
  const router = useRouter();

  const handleStage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // 1. 将表单转为对象
    let newItem: any = {};
    formData.forEach((value, key) => {
      if (key === 'sha') return;
      newItem[key] = value;
    });

    // 2. 自动生成 ID (如果表单没填且是新增模式)
    // 这里简单判断：如果 currentList 里没有这个 ID，就是新增
    // 注意：这依赖于表单里有一个 name="id" 的输入框，或者我们在下面逻辑处理
    
    // 3. 计算新的列表 (Add or Update)
    let newList = [...currentList];
    const existingIndex = newList.findIndex(item => item[idField] === newItem[idField]);

    let desc = "";

    if (existingIndex >= 0) {
      // 修改现有
      newList[existingIndex] = { ...newList[existingIndex], ...newItem };
      desc = `UPDATE ITEM: ${newItem[idField]} in ${filename}`;
    } else {
      // 新增
      // 如果没有ID，生成一个随机ID (针对 Timeline/Moments 这种自动生成ID的情况)
      if (!newItem[idField]) {
         newItem[idField] = `${filename.split('.')[0].toUpperCase()}_${Math.floor(Date.now()/1000)}`;
      }
      // 新增到最前面
      newList = [newItem, ...newList];
      desc = `ADD ITEM: ${newItem[idField]} to ${filename}`;
    }

    // 4. 触发暂存事件
    const event = new CustomEvent("add-to-staging", {
      detail: {
        uiId: Math.random().toString(36).substr(2, 9),
        type: "SAVE_DATA",
        desc: desc,
        filename: filename,
        data: newList, // 发送完整的、修改后的数组
        sha: sha
      }
    });
    window.dispatchEvent(event);
    
    // 5. 跳转回后台首页 (或刷新)
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