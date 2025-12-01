"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface NebulaNode {
  id: string;
  label: string;
  type: "POST" | "FRIEND";
  link: string;
  date?: string;
}

export default function NebulaTerminal({ nodes }: { nodes: NebulaNode[] }) {
  const router = useRouter();
  const [input, setInput] = useState("");
  
  const defaultHistory = [
    "NEBULA_OS [Version 4.0.2]", 
    "(c) Endfield Industries. All rights reserved.",
    "Type '/help' to see available commands.",
    ""
  ];
  
  // 屏幕显示的日志历史
  const [history, setHistory] = useState<string[]>(defaultHistory);
  // 当前目录
  const [cwd, setCwd] = useState<string>("~"); 
  const [isMounted, setIsMounted] = useState(false);

  // === 1. 新增：命令历史记录 (用于 ↑ ↓ 切换) ===
  const [commandBuffer, setCommandBuffer] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1); // -1 表示在最新行

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const constraintsRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    const savedHistory = localStorage.getItem("nebula_term_history");
    const savedCwd = localStorage.getItem("nebula_term_cwd");
    // 读取命令历史缓存（可选，体验更好）
    const savedCmds = localStorage.getItem("nebula_term_cmds");

    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
    }
    if (savedCwd) setCwd(savedCwd);
    if (savedCmds) {
      try { setCommandBuffer(JSON.parse(savedCmds)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("nebula_term_history", JSON.stringify(history));
      localStorage.setItem("nebula_term_cwd", cwd);
      localStorage.setItem("nebula_term_cmds", JSON.stringify(commandBuffer));
    }
  }, [history, cwd, commandBuffer, isMounted]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isMounted]);

  const handleFocus = () => inputRef.current?.focus();

  // === 2. 修改：处理按键事件 (支持 ↑ ↓) ===
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    // --- 历史记录切换逻辑 ---
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandBuffer.length === 0) return;
      
      const newIndex = historyPointer === -1 
        ? commandBuffer.length - 1 
        : Math.max(0, historyPointer - 1);
      
      setHistoryPointer(newIndex);
      setInput(commandBuffer[newIndex]);
    } 
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (commandBuffer.length === 0 || historyPointer === -1) {
        setInput("");
        return;
      }

      const newIndex = historyPointer + 1;
      if (newIndex >= commandBuffer.length) {
        setHistoryPointer(-1);
        setInput("");
      } else {
        setHistoryPointer(newIndex);
        setInput(commandBuffer[newIndex]);
      }
    }
    // --- 回车执行逻辑 ---
    else if (e.key === "Enter") {
      const cmd = input.trim();
      if (!cmd) return;

      // 保存到命令历史
      const newCommandBuffer = [...commandBuffer, cmd];
      setCommandBuffer(newCommandBuffer);
      setHistoryPointer(-1); // 重置指针到最新

      // 记录屏幕日志
      const currentHistory = [...history, `${getCliPrompt()} ${cmd}`];
      
      const args = cmd.replace(/^\//, "").split(" ");
      const command = args[0].toLowerCase();
      const target = args[1];

      switch (command) {
        case "help":
          currentHistory.push(
            "AVAILABLE COMMANDS:",
            "  /ls              List directory contents",
            "  /cd [dir]        Change directory",
            "  /cat [file]      Open file/link",
            "  /sudo [pwd]      Login to Admin Panel",
            "  /clear           Clear terminal & cache",
            "  /exit            Return to home"
          );
          break;

        case "sudo":
          // === 3. 修改：Sudo 逻辑增强 ===
          
          // A. 先显示正在检查
          currentHistory.push("Checking authentication status...");
          setHistory([...currentHistory]); // 强制先刷新一次UI显示这行字
          setInput(""); 

          try {
            // B. 检查是否已经登录
            const authCheck = await fetch("/api/auth/check");
            const { authenticated } = await authCheck.json();

            if (authenticated) {
              setHistory(prev => [
                ...prev,
                ">> ALREADY LOGGED IN.",
                ">> REDIRECTING TO ADMIN PANEL..."
              ]);
              setTimeout(() => router.push("/admin"), 800);
              return; // 直接结束
            }

            // C. 如果没登录，检查参数
            if (!target) {
              setHistory(prev => [...prev, "usage: sudo [password]"]);
              break;
            }

            // D. 没登录且有参数，验证密码
            const res = await fetch("/api/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ password: target }),
            });

            if (res.ok) {
              setHistory(prev => [
                ...prev, 
                ">> ACCESS GRANTED.", 
                ">> ESTABLISHING SECURE CONNECTION..."
              ]);
              setTimeout(() => router.push("/admin"), 1000);
            } else {
              setHistory(prev => [
                ...prev, 
                ">> ACCESS DENIED: Invalid password."
              ]);
            }
          } catch (error) {
            setHistory(prev => [
              ...prev, 
              ">> SYSTEM ERROR: Connection failed."
            ]);
          }
          return;

        case "clear":
          setHistory([]);
          localStorage.removeItem("nebula_term_history");
          setInput("");
          return; 

        case "exit":
          router.push("/");
          break;

        case "ls":
        case "ll":
          if (cwd === "~") {
            currentHistory.push("drwxr-xr-x  admin  posts/", "drwxr-xr-x  admin  friends/");
          } else if (cwd === "~/posts") {
            const posts = nodes.filter(n => n.type === "POST");
            posts.forEach(p => currentHistory.push(`-rw-r--r--  ${p.date}  ${p.id.replace('post-', '')}.md`));
            currentHistory.push(`Total: ${posts.length} files.`);
          } else if (cwd === "~/friends") {
            const friends = nodes.filter(n => n.type === "FRIEND");
            friends.forEach(f => currentHistory.push(`lrwxrwxrwx  LINK  ${f.label.replace(/\s+/g, '_')}.lnk`));
            currentHistory.push(`Total: ${friends.length} links.`);
          }
          break;

        case "cd":
          if (!target || target === "~") setCwd("~");
          else if (target === "..") setCwd("~");
          else if (target === "posts" && cwd === "~") setCwd("~/posts");
          else if (target === "friends" && cwd === "~") setCwd("~/friends");
          else currentHistory.push(`cd: no such file or directory: ${target}`);
          break;

        case "cat":
        case "open":
          if (!target) {
            currentHistory.push("usage: cat [filename]");
            break;
          }
          let foundNode: NebulaNode | undefined;
          if (cwd === "~/posts") {
            const searchKey = target.replace(".md", "");
            foundNode = nodes.find(n => n.type === "POST" && n.id.replace('post-', '') === searchKey);
          } else if (cwd === "~/friends") {
            const searchKey = target.replace(".lnk", "").toLowerCase();
            foundNode = nodes.find(n => n.type === "FRIEND" && n.label.replace(/\s+/g, '_').toLowerCase() === searchKey);
          } else {
            currentHistory.push("cat: permission denied. Please enter a directory first.");
          }

          if (foundNode) {
            currentHistory.push(`Opening ${target}...`, "Redirecting sequence initiated.");
            setTimeout(() => router.push(foundNode!.link), 800);
          } else if (cwd !== "~") {
            currentHistory.push(`cat: ${target}: No such file`);
          }
          break;

        default:
          currentHistory.push(`zsh: command not found: ${command}`);
      }

      setHistory(currentHistory);
      setInput("");
    }
  };

  const getCliPrompt = () => `admin@nebula:${cwd}$`;

  if (!isMounted) return null;

  return (
    <div ref={constraintsRef} className="fixed inset-0 z-50 pointer-events-none flex items-end justify-center pb-8 px-4 md:px-20 md:pb-12">
      <motion.div 
        drag 
        dragConstraints={constraintsRef} 
        dragElastic={0.1} 
        dragMomentum={false} 
        whileDrag={{ scale: 1.02, cursor: "grabbing" }}
        className="w-full max-w-2xl bg-black/90 backdrop-blur-xl border border-white/20 p-4 font-mono text-xs md:text-sm shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col gap-2 rounded-sm cursor-grab active:cursor-grabbing pointer-events-auto"
        style={{ height: '320px' }} 
        onClick={handleFocus}
      >
        <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-1 select-none pointer-events-none">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
          <div className="text-[10px] text-gray-500">NEBULA_TERMINAL_V4.4 // LOCAL_STORAGE_ACTIVE</div>
        </div>

        <div 
          ref={scrollRef}
          onPointerDownCapture={(e) => e.stopPropagation()} 
          className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent space-y-1 cursor-text"
        >
          {history.map((line, i) => (
            <div key={i} className="text-gray-300 break-all whitespace-pre-wrap">
              {line.startsWith("admin@nebula") ? (
                <span>
                  <span className="text-green-500">admin@nebula</span>
                  <span className="text-white">:</span>
                  <span className="text-blue-400">{line.split('$')[0].split(':')[1]}</span>
                  <span className="text-white">$ </span>
                  <span className="text-endfield-accent">{line.split('$')[1]}</span>
                </span>
              ) : (
                line
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-white">
          <span className="text-green-500 shrink-0">admin@nebula</span>
          <span className="">:</span>
          <span className="text-blue-400 shrink-0">{cwd}</span>
          <span className="">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            // 绑定新的事件处理函数
            onKeyDown={handleKeyDown}
            onPointerDownCapture={(e) => e.stopPropagation()} 
            className="bg-transparent border-none outline-none flex-1 text-endfield-accent caret-endfield-accent"
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </motion.div>
    </div>
  );
}