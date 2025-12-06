import { fetchJsonData, saveJsonData } from "@/lib/github";
import { revalidatePath } from "next/cache";
import Navbar from "@/components/Navbar";
import Link from "next/link";

// 兼容 Cloudflare Pages
export const runtime = 'edge';

// Action: 新增日志
async function addLogAction(formData: FormData) {
  "use server";
  const sha = formData.get("sha") as string;
  const file = await fetchJsonData("timeline.json");
  const currentLogs = file?.data || [];

  const newLog = {
    id: `LOG_${Math.floor(Date.now() / 1000)}`, // 自动生成ID
    date: formData.get("date") as string,
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    type: formData.get("type") as string,
  };

  // 新日志加在最前面
  const updatedLogs = [newLog, ...currentLogs];

  await saveJsonData("timeline.json", updatedLogs, file?.sha || sha);
  revalidatePath("/timeline");
  revalidatePath("/admin/timeline");
}

// Action: 删除日志
async function deleteLogAction(formData: FormData) {
  "use server";
  const idToDelete = formData.get("id") as string;
  const file = await fetchJsonData("timeline.json");
  if (!file) return;

  const updatedLogs = (file.data as any[]).filter(l => l.id !== idToDelete);
  await saveJsonData("timeline.json", updatedLogs, file.sha);
  revalidatePath("/timeline");
  revalidatePath("/admin/timeline");
}

export default async function AdminTimelinePage() {
  const file = await fetchJsonData("timeline.json");
  const logs = file?.data || [];
  const sha = file?.sha || "";

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-mono">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        
        <div className="mb-6">
          <Link href="/admin" className="text-xs text-gray-500 hover:text-white flex items-center gap-1 w-fit">
             &lt; RETURN_TO_DASHBOARD
          </Link>
        </div>

        <h1 className="text-2xl text-endfield-accent mb-8 border-b border-white/10 pb-2">
          MANAGE: SYSTEM_TIMELINE
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* === 左侧：添加表单 === */}
          <div className="lg:col-span-5">
            <div className="bg-white/5 border border-white/10 p-6 sticky top-24">
              <h3 className="text-sm font-bold text-gray-400 mb-4 border-l-2 border-endfield-accent pl-2">NEW_ENTRY</h3>
              
              <form action={addLogAction} className="space-y-4">
                <input type="hidden" name="sha" value={sha} />
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="group">
                     <label className="block text-[10px] text-endfield-accent mb-1">DATE</label>
                     <input type="date" name="date" required className="w-full bg-black border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none text-white"/>
                   </div>
                   <div className="group">
                     <label className="block text-[10px] text-endfield-accent mb-1">TYPE</label>
                     <select name="type" className="w-full bg-black border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none text-white">
                       <option value="MILESTONE">MILESTONE (Yellow)</option>
                       <option value="UPDATE">UPDATE (Cyan)</option>
                       <option value="FIX">FIX (Gray)</option>
                       <option value="ALERT">ALERT (Red)</option>
                     </select>
                   </div>
                </div>

                <div className="group">
                  <label className="block text-[10px] text-gray-500 mb-1">TITLE</label>
                  <input name="title" required className="w-full bg-black border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none text-white"/>
                </div>

                <div className="group">
                  <label className="block text-[10px] text-gray-500 mb-1">CONTENT</label>
                  <textarea name="content" required rows={4} className="w-full bg-black border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none text-white font-mono"/>
                </div>

                <button className="w-full bg-endfield-accent text-black font-bold py-3 hover:bg-white transition-colors uppercase tracking-widest text-xs mt-4">
                  + COMMIT_LOG
                </button>
              </form>
            </div>
          </div>

          {/* === 右侧：日志列表 === */}
          <div className="lg:col-span-7">
             <div className="space-y-3">
               {logs.map((log: any) => (
                 <div key={log.id} className="flex gap-4 bg-white/5 border border-white/10 p-4 hover:border-endfield-accent transition-colors group">
                    <div className="flex-1">
                       <div className="flex items-center gap-2 mb-1">
                         <span className={`text-[9px] px-1 border ${log.type === 'MILESTONE' ? 'border-[#FCEE21] text-[#FCEE21]' : 'border-gray-500 text-gray-500'}`}>
                           {log.type}
                         </span>
                         <span className="text-xs text-gray-500 font-mono">{log.date}</span>
                       </div>
                       <div className="text-sm font-bold text-white mb-2">{log.title}</div>
                       <div className="text-xs text-gray-400 font-mono line-clamp-2">{log.content}</div>
                    </div>
                    
                    <div className="flex flex-col justify-between items-end">
                       <span className="text-[9px] text-gray-700">{log.id}</span>
                       <form action={deleteLogAction}>
                         <input type="hidden" name="id" value={log.id} />
                         <button className="text-[10px] text-red-500 border border-red-500/30 px-2 py-1 hover:bg-red-600 hover:text-white transition-colors">
                           DEL
                         </button>
                       </form>
                    </div>
                 </div>
               ))}
             </div>
          </div>

        </div>
      </div>
    </main>
  );
}