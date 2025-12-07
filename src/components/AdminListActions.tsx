"use client";

interface Props {
  filename: string;   // 例如 "friends.json"
  sha: string;
  itemId: string;     // 要删除的条目 ID
  itemName: string;   // 用于显示的名称
  fullList: any[];    // 完整的当前列表数据
}

export default function AdminListActions({ filename, sha, itemId, itemName, fullList }: Props) {
  
  const handleStageDelete = () => {
    // 1. 在本地计算出删除后的新列表
    const newList = fullList.filter((item) => item.id !== itemId);

    // 2. 触发暂存事件：保存这个新列表
    const event = new CustomEvent("add-to-staging", {
      detail: {
        uiId: Math.random().toString(36).substr(2, 9),
        type: "SAVE_DATA",
        desc: `DELETE ITEM: ${itemName} from ${filename}`,
        filename: filename,
        data: newList,
        sha: sha
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <button 
      onClick={handleStageDelete}
      className="text-xs text-gray-500 hover:text-red-500 border border-transparent hover:border-red-500/30 px-2 py-1 transition-colors uppercase"
    >
      [DEL_STAGE]
    </button>
  );
}