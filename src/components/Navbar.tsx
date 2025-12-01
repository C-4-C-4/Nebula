"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import WormholeOverlay from "@/components/WormholeOverlay";

const navItems = [
  { name: "HOME", path: "/", label: "首页" },
  { name: "NEBULA", path: "/nebula", label: "星图" },
  { name: "FRIENDS", path: "/friends", label: "友联" },
  { name: "ABOUT", path: "/about", label: "关于" },
];

// 新增 props 定义
export default function Navbar({ logoText = "ENDFIELD.SYS" }: { logoText?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isWarping, setIsWarping] = useState(false);

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    if (path === "/nebula" && pathname !== "/nebula") {
      e.preventDefault();
      setIsWarping(true);
      setTimeout(() => {
        router.push(path);
      }, 2000);
    }
  };

  return (
    <>
      <WormholeOverlay isWarping={isWarping} />

      <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-endfield-base/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* LOGO: 使用传入的 text */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-endfield-accent animate-pulse" />
            <span className="font-sans text-xl font-bold tracking-tighter text-white uppercase">
              {logoText}
            </span>
          </div>

          {/* ...其余部分保持不变... */}
          <div className="flex gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link 
                  key={item.name} 
                  href={item.path} 
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