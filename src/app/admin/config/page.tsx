import { fetchJsonData, saveJsonData } from "@/lib/github";
import { revalidatePath } from "next/cache";
import Navbar from "@/components/Navbar";

async function saveConfigAction(formData: FormData) {
  "use server";
  const sha = formData.get("sha") as string;
  
  const newConfig = {
    copyright: formData.get("copyright"),
    icp: formData.get("icp"),
    police: formData.get("police")
  };

  await saveJsonData("config.json", newConfig, sha);
  // 刷新全站缓存，因为 Footer 在所有页面都有
  revalidatePath("/", "layout"); 
}

export default async function AdminConfigPage() {
  const file = await fetchJsonData("config.json");
  
  // 初始默认值
  const data = file?.data || { copyright: "", icp: "", police: "" };
  const sha = file?.sha || "";

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-mono selection:bg-endfield-accent selection:text-black">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-2xl text-endfield-accent mb-8 border-b border-white/10 pb-2">
          SYSTEM_CONFIGURATION
        </h1>

        <form action={saveConfigAction} className="space-y-6">
          <input type="hidden" name="sha" value={sha} />

          <div className="group">
             <label className="block text-[10px] text-endfield-accent mb-1">COPYRIGHT_TEXT</label>
             <input 
               name="copyright" 
               defaultValue={data.copyright} 
               className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none"
               placeholder="e.g. 2024 Endfield Industries"
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="group">
               <label className="block text-[10px] text-gray-500 mb-1">ICP_LICENSE (ICP备案号)</label>
               <input 
                 name="icp" 
                 defaultValue={data.icp} 
                 className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none"
                 placeholder="e.g. 京ICP备000000号"
               />
             </div>
             <div className="group">
               <label className="block text-[10px] text-gray-500 mb-1">POLICE_BADGE (公网安备)</label>
               <input 
                 name="police" 
                 defaultValue={data.police} 
                 className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none"
                 placeholder="e.g. 京公网安备000000号"
               />
             </div>
          </div>

          <div className="p-4 bg-endfield-accent/5 border border-endfield-accent/20 text-[10px] text-gray-400 mt-4">
             NOTICE: Changes to global configuration may take a few minutes to propagate due to caching strategies on the edge network.
          </div>

          <button type="submit" className="w-full bg-endfield-accent text-black font-bold py-3 hover:bg-white transition-colors uppercase tracking-widest mt-8">
            UPDATE_SYSTEM_CONFIG
          </button>
        </form>
      </div>
    </main>
  );
}