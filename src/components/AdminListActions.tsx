"use client";

interface Props {
  filename: string;
  sha: string;
  itemId: string;
  itemName: string;
  fullList: any[];
}

export default function AdminListActions({ filename, sha, itemId, itemName, fullList }: Props) {
  
  const handleStageDelete = () => {
    // === 关键修复开始：读取本地暂存区作为基准 ===
    let listToFilter = fullList;

    try {
      const savedBuffer = localStorage.getItem("nebula_staging_buffer");
      if (savedBuffer) {
        const buffer = JSON.parse(savedBuffer);
        // 查找是否已经有针对当前文件的暂存操作
        const pendingOp = buffer.find((op: any) => 
          op.type === 'SAVE_DATA' && op.filename === filename
        );
        
        if (pendingOp && Array.isArray(pendingOp.data)) {
          // 基于暂存区的数据进行删除
          listToFilter = pendingOp.data;
        }
      }
    } catch (err) {
      console.error("Failed to read staging for delete", err);
    }
    // === 关键修复结束 ===

    // 执行过滤
    const newList = listToFilter.filter((item) => item.id !== itemId);

    const event = new CustomEvent("add-to-staging", {
      detail: {
        uiId: Math.random().toString(36).substr(2, 9),
        type: "SAVE_DATA",
        desc: `DELETE ITEM: ${itemName} from ${filename}`,
        filename: filename,
        data: newList, // 这里发送的是基于最新状态过滤后的数据
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