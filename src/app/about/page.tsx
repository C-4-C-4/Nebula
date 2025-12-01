import MatrixBackground from "@/components/MatrixBackground";
import aboutData from "@/data/about.json";
import Comments from "@/components/Comments"; 
import { fetchJsonData } from "@/lib/github";
import Navbar from "@/components/Navbar";
import TechModule from "@/components/TechModule"; // 引入刚才创建的新组件

export default async function AboutPage() {
  // 服务端读取配置
  const file = await fetchJsonData("config.json");
  const giscusConfig = file?.data?.giscusConfig || {};

  return (
    <main className="min-h-screen relative text-white selection:bg-endfield-accent selection:text-black">
      <MatrixBackground />
      <div className="fixed inset-0 bg-gradient-to-t from-endfield-base via-transparent to-transparent pointer-events-none z-0" />
      
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 relative z-10">
        
        {/* 页面标题 */}
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

        {/* 主体卡片容器 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-endfield-surface/50 border border-white/10 p-8 relative backdrop-blur-sm">
           
           <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-endfield-accent" />
           <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-endfield-accent" />
           <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-endfield-accent" />
           <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-endfield-accent" />

           {/* 左侧：个人信息 */}
           <div className="lg:col-span-4 flex flex-col gap-6 border-b lg:border-b-0 lg:border-r border-white/10 pb-8 lg:pb-0 lg:pr-8">
              <div className="relative w-full aspect-square border-2 border-white/10 p-2 group">
                 <div className="absolute inset-0 bg-endfield-accent/5 group-hover:bg-endfield-accent/10 transition-colors" />
                 <div className="absolute w-full h-1 bg-endfield-accent/50 top-0 left-0 animate-[scan_3s_linear_infinite] opacity-50" />
                 <img 
                   src={aboutData.avatar} 
                   alt="Avatar" 
                   className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                 />
                 <div className="absolute bottom-4 right-4 text-[10px] font-mono text-endfield-accent bg-black/80 px-2 py-1">
                   IMG_SOURCE_RAW
                 </div>
              </div>

              <div className="space-y-4">
                 <div>
                   <label className="text-[10px] text-endfield-dim font-mono block mb-1">CODENAME</label>
                   <div className="text-3xl font-bold uppercase tracking-wider">{aboutData.blogger}</div>
                 </div>
                 <div>
                   <label className="text-[10px] text-endfield-dim font-mono block mb-1">AFFILIATION</label>
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-endfield-accent rounded-full animate-pulse" />
                     <span className="text-sm font-bold">{aboutData.siteName}</span>
                   </div>
                 </div>
                 <div>
                   <label className="text-[10px] text-endfield-dim font-mono block mb-1">ROLE</label>
                   <div className="text-sm font-mono text-gray-300 border border-white/10 px-3 py-2 bg-white/5">
                     {aboutData.role}
                   </div>
                 </div>
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

           {/* 右侧：详细介绍与技术栈 */}
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
                    {/* 使用新组件 */}
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

        {/* 评论区 */}
        <div className="mt-12 max-w-4xl mx-auto">
           <Comments config={giscusConfig} />
        </div>

      </div>
    </main>
  );
}