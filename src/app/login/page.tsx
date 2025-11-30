"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import MatrixBackground from "@/components/MatrixBackground";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  // 用于侧边栏生成的随机数据流
  const [sideData, setSideData] = useState<string[]>([]);

  const router = useRouter();

  // 生成侧边栏随机数据的副作用
  useEffect(() => {
    if (isSuccess) {
      const interval = setInterval(() => {
        const hex = Math.random().toString(16).substring(2, 10).toUpperCase();
        setSideData(prev => [`0x${hex}`, ...prev].slice(0, 20));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isSuccess]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setIsSuccess(true);
      
      const bootLogs = [
        "VERIFYING_CREDENTIALS...",
        "ACCESS_TOKEN: GRANTED",
        "ESTABLISHING_SECURE_CHANNEL...",
        "LOADING_USER_PROFILE...",
        "SYSTEM_OVERRIDE: ENABLED",
        "WELCOME_BACK, ADMINISTRATOR."
      ];
      
      let step = 0;
      const interval = setInterval(() => {
        if (step < bootLogs.length) {
          setLogs(prev => [...prev, bootLogs[step]]);
          step++;
        } else {
          clearInterval(interval);
          // 动画播放完毕，跳转后台
          setTimeout(() => router.push("/admin"), 800);
        }
      }, 300);

    } else {
      setError("ACCESS_DENIED: INVALID_CREDENTIALS");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-endfield-base flex items-center justify-center font-mono text-white relative overflow-hidden">
      {/* 始终保留背景，但在动画时会被覆盖，防止闪烁 */}
      <MatrixBackground />
      
      {/* === 登录成功后的全屏引导动画 === */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-[#050505]/95 flex flex-col items-center justify-center overflow-hidden"
          >
            {/* --- 背景层：超巨大旋转圆环 (填补两侧空白) --- */}
            <motion.div
              className="absolute z-0 border border-white/5 rounded-full w-[150vw] h-[150vw]"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, ease: "linear", repeat: Infinity }}
            />
            <motion.div
              className="absolute z-0 border border-endfield-accent/5 rounded-full w-[120vw] h-[120vw] border-dashed"
              animate={{ rotate: -360 }}
              transition={{ duration: 80, ease: "linear", repeat: Infinity }}
            />

            {/* --- 装饰层：全屏网格线 --- */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] z-0 pointer-events-none" />

            {/* =======================================================
                HUD 填充区：左右两侧
               ======================================================= */}

            {/* --- 左侧 HUD：数据流与刻度 --- */}
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute left-0 top-0 bottom-0 w-64 border-r border-white/10 bg-black/20 hidden md:flex flex-col justify-between p-6 z-10"
            >
               {/* 左上：标题 */}
               <div className="text-xs font-bold text-endfield-accent border-l-2 border-endfield-accent pl-2">
                 SYS.DIAGNOSTICS
               </div>

               {/* 左中：滚动数据流 (填补左侧大黑边) */}
               <div className="flex-1 overflow-hidden my-8 mask-image-gradient flex flex-col justify-end">
                  {sideData.map((hex, i) => (
                    <div key={i} className="text-[10px] text-gray-600 font-mono">
                      MEM_ADDR: {hex}
                    </div>
                  ))}
               </div>

               {/* 左下：刻度尺 */}
               <div className="space-y-1">
                 {[...Array(10)].map((_, i) => (
                   <div key={i} className="h-[2px] bg-gray-800" style={{ width: `${Math.random() * 100}%` }} />
                 ))}
                 <div className="text-[9px] text-gray-500 mt-2">CALIBRATION_OK</div>
               </div>
            </motion.div>

            {/* --- 右侧 HUD：大号竖排文字与模块状态 --- */}
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute right-0 top-0 bottom-0 w-48 border-l border-white/10 bg-black/20 hidden md:flex flex-col items-end justify-between p-6 z-10"
            >
               {/* 右上：装饰方块 */}
               <div className="grid grid-cols-3 gap-1">
                 {[...Array(9)].map((_, i) => (
                   <div key={i} className="w-2 h-2 bg-endfield-accent/20 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                 ))}
               </div>

               {/* 右中：巨大的竖排装饰字 (填补右侧大黑边) */}
               <div className="writing-vertical-rl text-6xl font-bold text-white/5 select-none tracking-widest h-full text-center py-12">
                 INITIALIZATION
               </div>

               {/* 右下：模块检查列表 */}
               <div className="text-right space-y-2">
                 {['CORE', 'NET', 'SEC', 'UI'].map(item => (
                   <div key={item} className="flex items-center justify-end gap-2 text-[10px] text-gray-400">
                     <span>{item}</span>
                     <span className="text-endfield-accent">[OK]</span>
                   </div>
                 ))}
               </div>
            </motion.div>

            {/* =======================================================
                中央核心区
               ======================================================= */}
            <div className="relative z-20 w-full max-w-lg">
              <div className="text-center mb-8 opacity-50">
                 <div className="text-[10px] tracking-[1em] text-endfield-accent">LOADING</div>
              </div>

              <div className="p-8 border-l-4 border-endfield-accent bg-black/90 backdrop-blur-md relative overflow-hidden shadow-[0_0_100px_rgba(252,238,33,0.1)]">
                 {/* 扫描光束 */}
                 <motion.div 
                   initial={{ top: "-10%" }}
                   animate={{ top: "110%" }}
                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                   className="absolute left-0 top-0 w-full h-2 bg-white/10 blur-sm pointer-events-none"
                 />
                 
                 <h2 className="text-3xl font-bold text-endfield-accent mb-6 animate-pulse">
                   SYSTEM_BOOT_SEQUENCE
                 </h2>
                 
                 <div className="space-y-2 font-mono text-sm min-h-[160px]">
                   {logs.map((log, i) => (
                     <motion.div 
                       key={i}
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       className="text-green-500"
                     >
                       &gt; {log}
                     </motion.div>
                   ))}
                 </div>
              </div>
              
              <div className="mt-8 w-full h-1 bg-gray-900 relative overflow-hidden">
                 <motion.div 
                   initial={{ width: "0%" }}
                   animate={{ width: "100%" }}
                   transition={{ duration: 2.5, ease: "easeInOut" }}
                   className="absolute h-full bg-endfield-accent shadow-[0_0_10px_#FCEE21]"
                 />
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* === 正常的登录表单 (成功时隐藏) === */}
      {!isSuccess && (
        <div className="z-10 bg-black/80 border border-endfield-accent/50 p-8 w-full max-w-md backdrop-blur-md shadow-[0_0_30px_rgba(252,238,33,0.1)] relative">
          {/* 四角装饰 */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-endfield-accent"/>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-endfield-accent"/>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-endfield-accent"/>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-endfield-accent"/>

          <h1 className="text-2xl font-bold text-endfield-accent mb-6 tracking-widest text-center border-b border-white/10 pb-4">
            SYSTEM_LOGIN
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs text-gray-500 mb-2">admin@endfield:~$ enter_password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/20 p-3 text-endfield-accent outline-none focus:border-endfield-accent transition-colors"
                autoFocus
              />
            </div>

            {error && (
              <div className="text-red-500 text-xs bg-red-900/20 p-2 border border-red-900 animate-pulse">
                [ERROR] {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-endfield-accent text-black font-bold py-3 hover:bg-white transition-colors uppercase tracking-widest clip-path-button disabled:opacity-50 relative group overflow-hidden"
            >
              <span className="relative z-10">{loading ? "VERIFYING..." : "CONNECT"}</span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-200 z-0" />
            </button>
          </form>
        </div>
      )}
    </main>
  );
}