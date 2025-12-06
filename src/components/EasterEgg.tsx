"use client";
import { useEffect, useState } from "react";

const SECRET_CODE = "cccc4444";
const TARGET_URL = "https://github.com/C-4-C-4";

export default function EasterEgg() {
  const [inputBuffer, setInputBuffer] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 忽略功能键 (Ctrl, Alt 等)
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      setInputBuffer((prev) => {
        // 追加新字符，并转为小写 (防止 CapsLock 导致匹配失败)
        const updated = prev + e.key.toLowerCase();
        
        // 只保留最后 N 个字符 (N = 密码长度)
        // 这样可以避免内存无限增长，且逻辑最简单
        return updated.slice(-SECRET_CODE.length);
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 监听缓冲区变化
  useEffect(() => {
    if (inputBuffer === SECRET_CODE) {
      // === 触发彩蛋 ===
      
      // 1. 可选：播放一个音效或显示一个提示
      console.log(">> SECRET CODE ACTIVATED: JUMPING TO GITHUB...");
      
      // 2. 跳转 (在新标签页打开)
      window.open(TARGET_URL, "_blank");
      
      // 3. 重置缓冲区，防止重复触发
      setInputBuffer("");
    }
  }, [inputBuffer]);

  // 这个组件是不可见的，所以返回 null
  return null;
}