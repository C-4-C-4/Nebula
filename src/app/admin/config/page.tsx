import { fetchJsonData } from "@/lib/github";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import AdminDataForm from "@/components/AdminDataForm";

// 兼容 Cloudflare Pages
export const runtime = 'edge';

export default async function AdminConfigPage() {
  const file = await fetchJsonData("config.json");
  
  // 默认值兜底
  const data = file?.data || { 
    siteTitle: "Endfield Blog", 
    logoText: "ENDFIELD.SYS",
    favicon: "",
    bilibiliUid: "", 
    heroTitleLine1: "SYSTEM",
    heroTitleLine2: "OVERRIDE",
    copyright: "", icp: "", police: "" 
  };
  
  const giscus = data.giscusConfig || { repo: "", repoId: "", category: "", categoryId: "" };
  const sha = file?.sha || "";

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-mono selection:bg-endfield-accent selection:text-black">
      <Navbar logoText={data.logoText} /> 
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link href="/admin" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1 w-fit group">
             <span>&lt;</span> <span className="group-hover:underline">RETURN_TO_DASHBOARD</span>
          </Link>
        </div>

        <h1 className="text-2xl text-endfield-accent mb-8 border-b border-white/10 pb-2">
          SYSTEM_CONFIGURATION
        </h1>

        {/* 使用 AdminDataForm 包裹，自动处理暂存逻辑 */}
        <AdminDataForm filename="config.json" sha={sha}>
          
          {/* === 1. 全局设置 === */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 border-l-2 border-endfield-accent pl-2">GLOBAL_SETTINGS</h3>
            
            <div className="group">
               <label className="block text-[10px] text-endfield-accent mb-1">BROWSER_TAB_ICON (Favicon URL)</label>
               <input 
                 name="favicon" 
                 defaultValue={data.favicon} 
                 className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none text-gray-300"
                 placeholder="e.g. https://example.com/icon.png"
               />
            </div>

            {/* === 补回：B站 UID 输入框 === */}
            <div className="group">
               <label className="block text-[10px] text-endfield-accent mb-1">BILIBILI_UID</label>
               <input 
                 name="bilibiliUid" 
                 defaultValue={data.bilibiliUid} 
                 className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none text-gray-300"
                 placeholder="e.g. 3493265644987624"
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-[10px] text-endfield-accent mb-1">BROWSER_TAB_TITLE</label>
                <input name="siteTitle" defaultValue={data.siteTitle} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none"/>
              </div>
              <div className="group">
                <label className="block text-[10px] text-endfield-accent mb-1">NAV_LOGO_TEXT</label>
                <input name="logoText" defaultValue={data.logoText} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none"/>
              </div>
            </div>
          </div>

          {/* === 2. 首页大图文字 === */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 border-l-2 border-endfield-accent pl-2">HERO_SECTION_TEXT</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-[10px] text-white mb-1">LINE_1 (White)</label>
                <input name="heroTitleLine1" defaultValue={data.heroTitleLine1} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none font-bold"/>
              </div>
              <div className="group">
                <label className="block text-[10px] text-gray-400 mb-1">LINE_2 (Gradient)</label>
                <input name="heroTitleLine2" defaultValue={data.heroTitleLine2} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none font-bold"/>
              </div>
            </div>
          </div>

          {/* === 3. Giscus 评论配置 === */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 border-l-2 border-endfield-accent pl-2">COMMS_MODULE (GISCUS)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="group">
                 <label className="block text-[10px] text-gray-500 mb-1">REPO (user/repo)</label>
                 <input name="giscusConfig.repo" defaultValue={giscus.repo} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none font-mono text-gray-300"/>
               </div>
               <div className="group">
                 <label className="block text-[10px] text-gray-500 mb-1">REPO_ID</label>
                 <input name="giscusConfig.repoId" defaultValue={giscus.repoId} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none font-mono text-gray-300"/>
               </div>
               <div className="group">
                 <label className="block text-[10px] text-gray-500 mb-1">CATEGORY</label>
                 <input name="giscusConfig.category" defaultValue={giscus.category} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none font-mono text-gray-300"/>
               </div>
               <div className="group">
                 <label className="block text-[10px] text-gray-500 mb-1">CATEGORY_ID</label>
                 <input name="giscusConfig.categoryId" defaultValue={giscus.categoryId} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none font-mono text-gray-300"/>
               </div>
            </div>
            <p className="text-[10px] text-gray-600">
              * Configure these at <a href="https://giscus.app" target="_blank" className="text-endfield-accent underline">giscus.app</a>
            </p>
          </div>

          {/* === 4. 页脚信息 === */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 border-l-2 border-endfield-accent pl-2">FOOTER_INFO</h3>
            <div className="group">
               <label className="block text-[10px] text-gray-500 mb-1">COPYRIGHT_TEXT</label>
               <input name="copyright" defaultValue={data.copyright} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="group">
                 <label className="block text-[10px] text-gray-500 mb-1">ICP_LICENSE</label>
                 <input name="icp" defaultValue={data.icp} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none"/>
               </div>
               <div className="group">
                 <label className="block text-[10px] text-gray-500 mb-1">POLICE_BADGE</label>
                 <input name="police" defaultValue={data.police} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none"/>
               </div>
            </div>
          </div>

        </AdminDataForm>
      </div>
    </main>
  );
}