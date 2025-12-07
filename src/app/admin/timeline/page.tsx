import { fetchJsonData } from "@/lib/github";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import AdminListForm from "@/components/AdminListForm";
import AdminListActions from "@/components/AdminListActions";

export const runtime = 'edge';

export default async function AdminTimelinePage() {
  const file = await fetchJsonData("timeline.json");
  const logs = file?.data || [];
  const sha = file?.sha || "";

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-mono">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-6"><Link href="/admin" className="text-xs text-gray-500 hover:text-white">&lt; RETURN</Link></div>
        <h1 className="text-2xl text-endfield-accent mb-8 border-b border-white/10 pb-2">MANAGE: TIMELINE</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5">
            <div className="bg-white/5 border border-white/10 p-6 sticky top-24">
              <h3 className="text-sm font-bold text-gray-400 mb-4">NEW_ENTRY</h3>
              
              <AdminListForm filename="timeline.json" sha={sha} currentList={logs} idField="id">
                 {/* 不显示 ID 输入框，让组件自动生成 */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                   <div className="group"><label className="block text-[10px] text-endfield-accent mb-1">DATE</label><input type="date" name="date" required className="w-full bg-black border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none text-white"/></div>
                   <div className="group"><label className="block text-[10px] text-endfield-accent mb-1">TYPE</label>
                     <select name="type" className="w-full bg-black border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none text-white">
                       <option value="MILESTONE">MILESTONE</option>
                       <option value="UPDATE">UPDATE</option>
                       <option value="FIX">FIX</option>
                       <option value="ALERT">ALERT</option>
                     </select>
                   </div>
                </div>
                <div className="group mb-4"><label className="block text-[10px] text-gray-500 mb-1">TITLE</label><input name="title" required className="w-full bg-black border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none text-white"/></div>
                <div className="group mb-4"><label className="block text-[10px] text-gray-500 mb-1">CONTENT</label><textarea name="content" required rows={4} className="w-full bg-black border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none text-white font-mono"/></div>
              </AdminListForm>
            </div>
          </div>

          <div className="lg:col-span-7">
             <div className="space-y-3">
               {logs.map((log: any) => (
                 <div key={log.id} className="flex gap-4 bg-white/5 border border-white/10 p-4 hover:border-endfield-accent transition-colors">
                    <div className="flex-1">
                       <div className="flex items-center gap-2 mb-1">
                         <span className="text-[9px] px-1 border border-gray-500 text-gray-500">{log.type}</span>
                         <span className="text-xs text-gray-500 font-mono">{log.date}</span>
                       </div>
                       <div className="text-sm font-bold text-white mb-2">{log.title}</div>
                       <div className="text-xs text-gray-400 font-mono line-clamp-2">{log.content}</div>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                       <span className="text-[9px] text-gray-700">{log.id}</span>
                       <AdminListActions filename="timeline.json" sha={sha} itemId={log.id} itemName={log.title} fullList={logs} />
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