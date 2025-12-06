import MatrixBackground from "@/components/MatrixBackground";
import aboutData from "@/data/about.json";
import Comments from "@/components/Comments"; 
import { fetchJsonData } from "@/lib/github";
import Navbar from "@/components/Navbar";
import TechModule from "@/components/TechModule";

export const revalidate = 3600;

export default async function AboutPage() {
  const file = await fetchJsonData("config.json");
  const giscusConfig = file?.data?.giscusConfig || {};

  return (
    <main className="min-h-screen relative text-white selection:bg-endfield-accent selection:text-black">
      <MatrixBackground />
      <div className="fixed inset-0 bg-gradient-to-t from-endfield-base via-transparent to-transparent pointer-events-none z-0" />
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 relative z-10">
        
        {/* 标题部分 */}
        <div className="mb-12 border-l-4 border-endfield-accent pl-6 py-2 flex justify-between items-end">
           <div>
             <h1 className="text-4xl md:text-6xl font-bold uppercase mb-2">
               Personnel_<span className="text-endfield-accent">File</span>
             </h1>
             <p className="text-xs font-mono text-endfield-dim">
               ACCESS LEVEL: PUBLIC // OPERATOR PROFILE
             </p>
           </div>
           <div className="hidden md:block text-right font-mono text-[10px] text-gray-500">
             <p>REF_ID: 9527-XK</p>
             <p>STATUS: ACTIVE</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-endfield-surface/50 border border-white/10 p-8 relative backdrop-blur-sm">
           <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-endfield-accent" />
           <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-endfield-accent" />
           <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-endfield-accent" />
           <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-endfield-accent" />

           {/* 左侧栏 */}
           <div className="lg:col-span-4 flex flex-col gap-6 border-b lg:border-b-0 lg:border-r border-white/10 pb-8 lg:pb-0 lg:pr-8">
              
              {/* === 头像区域 (修复版) === */}
              <div className="relative w-full aspect-square border-2 border-white/10 p-2 overflow-hidden">
                 
                 {/* 1. 扫描线动画 (保留) */}
                 {/* z-20 确保它在图片上面，pointer-events-none 确保鼠标能穿透它 */}
                 <div className="absolute w-full h-[2px] bg-endfield-accent top-0 left-0 animate-[scan_3s_linear_infinite] shadow-[0_0_15px_#FCEE21] z-20 pointer-events-none opacity-80" />
                 
                 {/* 2. 删除了之前的 "absolute inset-0 bg-..." 遮罩层，这就是导致泛白的原因 */}

                 {/* 3. 图片本体 */}
                 <img 
                   src={aboutData.avatar} 
                   alt="Avatar" 
                   className="w-full h-full object-cover"
                 />
                 
                 {/* 4. 右下角标签 */}
                 <div className="absolute bottom-4 right-4 text-[10px] font-mono text-endfield-accent bg-black/80 px-2 py-1 z-20">
                   IMG_SOURCE_RAW
                 </div>
              </div>
              {/* ======================= */}

              {/* 基础信息区域 */}
              <div className="space-y-6">
                 <div>
                   <label className="text-[10px] text-endfield-dim font-mono block mb-1">CODENAME</label>
                   <div className="text-3xl font-bold uppercase tracking-wider">{aboutData.blogger}</div>
                 </div>
                 
                 <div>
                   <label className="text-[10px] text-endfield-dim font-mono block mb-2">AFFILIATION</label>
                   <div className="text-lg font-bold flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-endfield-accent"></span>
                      {aboutData.siteName}
                   </div>
                 </div>

                 <div>
                   <label className="text-[10px] text-endfield-dim font-mono block mb-1">ROLE</label>
                   <div className="text-sm font-mono text-gray-300 border border-white/10 px-3 py-2 bg-white/5">
                     {aboutData.role}
                   </div>
                 </div>

                 {/* LOGO 区域 */}
                 {aboutData.logo && (
                   <div className="mt-2">
                     <label className="text-[10px] text-endfield-dim font-mono block mb-2">ORGANIZATION_LOGO</label>
                     <div className="w-full h-48 border border-white/10 bg-black/40 p-4 flex items-center justify-center">
                       <img 
                         src={aboutData.logo} 
                         alt="Affiliation Logo" 
                         className="w-full h-full object-contain" 
                       />
                     </div>
                   </div>
                 )}
              </div>

              <div className="mt-auto pt-6">
                <a 
                  href={`mailto:${aboutData.email}`}
                  className="block w-full text-center bg-endfield-accent text-black font-bold py-3 text-sm hover:bg-white transition-colors clip-path-button uppercase tracking-widest"
                >
                  SEND_TRANSMISSION
                </a>
                <p className="text-center text-[10px] text-gray-600 mt-2 font-mono">{aboutData.email}</p>
              </div>
           </div>

           {/* 右侧栏 */}
           <div className="lg:col-span-8 flex flex-col gap-10">
              <div>
                 <h3 className="text-lg font-bold text-endfield-accent mb-4 flex items-center gap-2">
                   <span className="w-1 h-4 bg-endfield-accent" />
                   // OPERATOR_RECORD
                 </h3>
                 <div className="text-gray-300 font-mono text-sm leading-loose whitespace-pre-wrap bg-black/40 border border-white/5 p-6 relative">
                    <div className="absolute top-4 right-4 w-20 h-20 opacity-10 pointer-events-none" 
                         style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 10px)' }} 
                    />
                    {aboutData.description}
                 </div>
              </div>

              <div>
                 <h3 className="text-lg font-bold text-endfield-accent mb-4 flex items-center gap-2">
                   <span className="w-1 h-4 bg-endfield-accent" />
                   // SYSTEM_MODULES
                 </h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {aboutData.stack.map(tech => (
                      <TechModule key={tech} tech={tech} />
                    ))}
                 </div>
              </div>

              <div className="mt-auto border-t border-dashed border-white/20 pt-4 flex justify-between text-[10px] text-gray-500 font-mono">
                 <span suppressHydrationWarning>LAST_SYNC: {new Date().toLocaleDateString()}</span>
                 <span>SECURITY_CLEARANCE: LEVEL_5</span>
              </div>
           </div>
        </div>
        
        <div className="mt-12 max-w-4xl mx-auto">
           <Comments config={giscusConfig} />
        </div>

      </div>
    </main>
  );
}