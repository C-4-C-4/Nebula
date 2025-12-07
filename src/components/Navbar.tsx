"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const moduleItems = [
  { name: "PROJECTS", path: "/projects", label: "项目" },
  { name: "NEBULA", path: "/nebula", label: "星图" },
  { name: "BANGUMI", path: "/bangumi", label: "追番" },
  { name: "MOMENTS", path: "/moments", label: "动态" },
  { name: "MUSIC", path: "/music", label: "音乐" },
  { name: "TIMELINE", path: "/timeline", label: "日志" },
];

const mainItems = [
  { name: "HOME", path: "/", label: "首页" },
  { type: "dropdown", name: "MODULES", label: "模组" }, 
  { name: "FRIENDS", path: "/friends", label: "友联" },
  { name: "ABOUT", path: "/about", label: "关于" },
];

export default function Navbar({ logoText = "ENDFIELD.SYS" }: { logoText?: string }) {
  const pathname = usePathname();
  const [isHovering, setIsHovering] = useState(false);
  
  // 新增：手机菜单开关状态
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 路由跳转时自动关闭手机菜单
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const isModuleActive = moduleItems.some(item => pathname === item.path);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-endfield-base/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* LOGO (始终显示) */}
          <Link href="/" className="flex items-center gap-2 group z-50">
            <div className="w-3 h-3 bg-endfield-accent animate-pulse" />
            <span className="font-sans text-xl font-bold tracking-tighter text-white uppercase group-hover:text-endfield-accent transition-colors truncate max-w-[200px]">
              {logoText}
            </span>
          </Link>

          {/* === 桌面端菜单 (md以上显示，手机隐藏) === */}
          <div className="hidden md:flex gap-8 items-center h-full">
            {mainItems.map((item) => {
              // 桌面端 Dropdown 逻辑 (保持不变)
              if (item.type === "dropdown") {
                return (
                  <div 
                    key={item.name}
                    className="relative h-full flex items-center"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <button className="flex flex-col items-center group cursor-pointer focus:outline-none h-full justify-center">
                      <div className="flex items-center gap-1">
                        <span className={`font-mono text-sm tracking-widest transition-colors duration-300 ${isModuleActive || isHovering ? 'text-endfield-accent' : 'text-gray-400 group-hover:text-white'}`}>
                          {item.name}
                        </span>
                        <svg className={`w-3 h-3 transition-transform duration-300 ${isHovering ? 'rotate-180 text-endfield-accent' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <span className="text-[10px] text-gray-600 uppercase opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-3">
                        {item.label}
                      </span>
                      {(isModuleActive || isHovering) && (
                        <motion.div layoutId="nav-indicator" className="absolute bottom-0 w-full h-[2px] bg-endfield-accent shadow-[0_0_10px_#FCEE21]" />
                      )}
                    </button>

                    <AnimatePresence>
                      {isHovering && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scaleY: 0.9 }}
                          animate={{ opacity: 1, y: 0, scaleY: 1 }}
                          exit={{ opacity: 0, y: 10, scaleY: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 w-40 bg-black/95 border border-white/20 backdrop-blur-xl shadow-2xl origin-top"
                        >
                          <div className="absolute top-0 left-0 w-full h-[2px] bg-endfield-accent" />
                          <div className="flex flex-col py-2">
                            {moduleItems.map((subItem) => {
                              const isSubActive = pathname === subItem.path;
                              return (
                                <Link 
                                  key={subItem.name} 
                                  href={subItem.path}
                                  className={`relative group/item px-4 py-3 text-xs font-mono tracking-wider flex items-center justify-between hover:bg-white/5 transition-colors ${isSubActive ? 'text-endfield-accent' : 'text-gray-400 hover:text-white'}`}
                                >
                                  <span>{subItem.name}</span>
                                  <span className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300 text-endfield-accent">&gt;</span>
                                  {isSubActive && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-endfield-accent" />}
                                </Link>
                              );
                            })}
                          </div>
                          <div className="h-1 w-full bg-white/5 flex justify-between px-1 items-center">
                             <div className="w-1 h-1 bg-white/20" />
                             <div className="w-1 h-1 bg-white/20" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
              // 普通菜单项
              const isActive = pathname === item.path;
              return (
                <Link key={item.name} href={item.path!} className="relative group h-full flex items-center">
                  <div className="flex flex-col items-center">
                    <span className={`font-mono text-sm tracking-widest transition-colors duration-300 ${isActive ? 'text-endfield-accent' : 'text-gray-400 group-hover:text-white'}`}>
                      {item.name}
                    </span>
                    <span className="text-[10px] text-gray-600 uppercase opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-3">{item.label}</span>
                    {isActive && <motion.div layoutId="nav-indicator" className="absolute bottom-0 w-full h-[2px] bg-endfield-accent shadow-[0_0_10px_#FCEE21]" />}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* === 手机端菜单按钮 (汉堡包图标) === */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="text-white p-2 focus:outline-none"
            >
              {isMobileOpen ? (
                // 关闭图标 X
                <svg className="w-6 h-6 text-endfield-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                // 菜单图标 ☰
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        
          {/* 右侧状态 (手机端隐藏) */}
          <div className="hidden md:block font-mono text-xs text-endfield-dim">
            SERVER: <span className="text-green-500">ONLINE</span>
          </div>
        </div>
      </nav>

      {/* === 手机端全屏菜单 (Overlay) === */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 px-6 md:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-6">
              {mainItems.map((item) => {
                // 手机端：如果是 MODULES，直接展开列出所有子项
                if (item.type === "dropdown") {
                  return (
                    <div key={item.name} className="flex flex-col gap-4 border-l-2 border-white/10 pl-4 ml-2">
                       <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">{item.name}</div>
                       <div className="grid grid-cols-2 gap-4">
                         {moduleItems.map(subItem => {
                           const isSubActive = pathname === subItem.path;
                           return (
                             <Link 
                               key={subItem.name} 
                               href={subItem.path}
                               className={`block p-3 border ${isSubActive ? 'border-endfield-accent text-endfield-accent bg-endfield-accent/10' : 'border-white/20 text-gray-300'}`}
                             >
                               <div className="text-sm font-bold">{subItem.name}</div>
                               <div className="text-[10px] opacity-60">{subItem.label}</div>
                             </Link>
                           )
                         })}
                       </div>
                    </div>
                  )
                }

                // 手机端：普通菜单项
                const isActive = pathname === item.path;
                return (
                  <Link 
                    key={item.name} 
                    href={item.path!} 
                    className={`text-2xl font-bold uppercase tracking-wider flex items-center gap-4 ${isActive ? 'text-endfield-accent' : 'text-white'}`}
                  >
                    {isActive && <div className="w-2 h-8 bg-endfield-accent" />}
                    <span>{item.name}</span>
                    <span className="text-xs font-mono text-gray-600 self-end mb-1">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}