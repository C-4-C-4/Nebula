"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // 引入 useRouter
import { motion } from "framer-motion";
import { useState } from "react";
import WormholeOverlay from "@/components/WormholeOverlay"; // 引入刚才写的组件

const navItems = [
  { name: "HOME", path: "/", label: "首页" },
  { name: "NEBULA", path: "/nebula", label: "星图" },
  { name: "FRIENDS", path: "/friends", label: "友联" },
  { name: "ABOUT", path: "/about", label: "关于" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isWarping, setIsWarping] = useState(false);

  // 处理点击事件
  const handleNavClick = (e: React.MouseEvent, path: string) => {
    // 只有点击 NEBULA 且当前不在 NEBULA 页面时，才触发穿越动画
    if (path === "/nebula" && pathname !== "/nebula") {
      e.preventDefault(); // 阻止默认跳转
      setIsWarping(true); // 开启穿越动画

      // 2秒后执行真正的跳转 (与 WormholeOverlay 的动画时长匹配)
      setTimeout(() => {
        router.push(path);
        // 注意：这里不需要 setIsWarping(false)，因为页面会刷新/卸载
      }, 2000);
    }
  };

  return (
    <>
      {/* 1. 放入全屏动画组件 */}
      <WormholeOverlay isWarping={isWarping} />

      <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-endfield-base/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* LOGO */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-endfield-accent animate-pulse" />
            <span className="font-sans text-xl font-bold tracking-tighter text-white">
              ENDFIELD<span className="text-endfield-accent">.SYS</span>
            </span>
          </div>

          {/* 菜单项 */}
          <div className="flex gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link 
                  key={item.name} 
                  href={item.path} 
                  // 2. 绑定点击事件拦截
                  onClick={(e) => handleNavClick(e, item.path)}
                  className="relative group"
                >
                  <div className="flex flex-col items-center">
                    <span className={`font-mono text-sm tracking-widest transition-colors duration-300 ${isActive ? 'text-endfield-accent' : 'text-gray-400 group-hover:text-white'}`}>
                      {item.name}
                    </span>
                    <span className="text-[10px] text-gray-600 uppercase opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-3">
                      {item.label}
                    </span>
                    
                    {isActive && (
                      <motion.div 
                        layoutId="nav-indicator"
                        className="absolute -bottom-5 w-full h-[2px] bg-endfield-accent shadow-[0_0_10px_#FCEE21]"
                      />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          
          <div className="hidden md:block font-mono text-xs text-endfield-dim">
            SERVER: <span className="text-green-500">ONLINE</span>
          </div>
        </div>
      </nav>
    </>
  );
}