import { fetchJsonData, saveJsonData } from "@/lib/github";
import { revalidatePath } from "next/cache";
import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation"; // 1. 引入重定向方法

async function saveConfigAction(formData: FormData) {
  "use server";
  const sha = formData.get("sha") as string;
  
  const newConfig = {
    // 全局设置
    siteTitle: formData.get("siteTitle"),
    logoText: formData.get("logoText"),
    favicon: formData.get("favicon"),
    
    // 首页大图文字
    heroTitleLine1: formData.get("heroTitleLine1"),
    heroTitleLine2: formData.get("heroTitleLine2"),
    
    // 页脚信息
    copyright: formData.get("copyright"),
    icp: formData.get("icp"),
    police: formData.get("police"),

    // Giscus 评论配置
    giscusConfig: {
      repo: formData.get("gRepo"),
      repoId: formData.get("gRepoId"),
      category: formData.get("gCategory"),
      categoryId: formData.get("gCategoryId"),
    }
  };

  await saveJsonData("config.json", newConfig, sha);
  // 刷新全站布局
  revalidatePath("/", "layout"); 

  // === 2. 保存成功后跳转回后台首页 ===
  redirect("/admin");
}

export default async function AdminConfigPage() {
  const file = await fetchJsonData("config.json");
  
  // 默认值兜底
  const data = file?.data || { 
    siteTitle: "Endfield Blog", 
    logoText: "ENDFIELD.SYS",
    favicon: "",
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
        <h1 className="text-2xl text-endfield-accent mb-8 border-b border-white/10 pb-2">
          SYSTEM_CONFIGURATION
        </h1>

        <form action={saveConfigAction} className="space-y-8">
          <input type="hidden" name="sha" value={sha} />

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
                 <input name="gRepo" defaultValue={giscus.repo} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none font-mono text-gray-300"/>
               </div>
               <div className="group">
                 <label className="block text-[10px] text-gray-500 mb-1">REPO_ID</label>
                 <input name="gRepoId" defaultValue={giscus.repoId} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none font-mono text-gray-300"/>
               </div>
               <div className="group">
                 <label className="block text-[10px] text-gray-500 mb-1">CATEGORY</label>
                 <input name="gCategory" defaultValue={giscus.category} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none font-mono text-gray-300"/>
               </div>
               <div className="group">
                 <label className="block text-[10px] text-gray-500 mb-1">CATEGORY_ID</label>
                 <input name="gCategoryId" defaultValue={giscus.categoryId} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none font-mono text-gray-300"/>
               </div>
            </div>
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

          <button type="submit" className="w-full bg-endfield-accent text-black font-bold py-3 hover:bg-white transition-colors uppercase tracking-widest mt-8">
            UPDATE_SYSTEM_CONFIG
          </button>
        </form>
      </div>
    </main>
  );
}