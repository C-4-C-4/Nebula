import { fetchJsonData } from "@/lib/github";

// 默认配置，防止文件读取失败导致报错
const DEFAULT_CONFIG = {
  copyright: "© 2024 ENDFIELD.SYS",
  icp: "",
  police: ""
};

export default async function Footer() {
  // 从 GitHub (或本地模拟环境) 读取配置
  // 注意：在本地开发时，fetchJsonData 会读取 GitHub 上的数据，
  // 如果你想读本地文件，可以写个本地读取逻辑，但为了统一这里复用 github.ts
  const file = await fetchJsonData("config.json");
  const config = file ? file.data : DEFAULT_CONFIG;

  return (
    <footer className="border-t border-white/10 bg-black/80 backdrop-blur-sm mt-auto relative z-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          
          {/* 左侧：版权信息 */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-endfield-accent animate-pulse" />
            <span>{config.copyright}</span>
          </div>

          {/* 右侧：备案信息 */}
          <div className="flex flex-col md:flex-row items-center gap-4">
             {config.icp && (
               <a href="https://beian.miit.gov.cn/" target="_blank" className="hover:text-endfield-accent transition-colors">
                 {config.icp}
               </a>
             )}
             
             {config.police && (
               <div className="flex items-center gap-1 hover:text-endfield-accent transition-colors cursor-pointer">
                 {/* 公安备案图标 (简易版) */}
                 <span className="w-3 h-3 border border-current rounded-full flex items-center justify-center">👮</span>
                 <span>{config.police}</span>
               </div>
             )}
             
             <div className="hidden md:block w-[1px] h-3 bg-white/20" />
             <span>SYS_STATUS: NORMAL</span>
          </div>

        </div>
      </div>
    </footer>
  );
}