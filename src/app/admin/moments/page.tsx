import { fetchJsonData } from "@/lib/github";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import AdminListForm from "@/components/AdminListForm";
import AdminListActions from "@/components/AdminListActions";
import RssAvatar from "@/components/RssAvatar"; // 1. 引入新组件

// 兼容 Cloudflare Pages
export const runtime = 'edge';

export default async function AdminMomentsPage() {
  const file = await fetchJsonData("rss.json");
  const feeds = file?.data || [];
  const sha = file?.sha || "";

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-mono">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        
        <div className="mb-6">
          <Link href="/admin" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1 w-fit group">
             <span>&lt;</span> <span className="group-hover:underline">RETURN_TO_DASHBOARD</span>
          </Link>
        </div>

        <h1 className="text-2xl text-endfield-accent mb-8 border-b border-white/10 pb-2">
          MANAGE: RSS_SUBSCRIPTIONS
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* 左侧表单 */}
          <div className="lg:col-span-5">
            <div className="bg-white/5 border border-white/10 p-6 sticky top-24">
              <h3 className="text-sm font-bold text-gray-400 mb-4 border-l-2 border-endfield-accent pl-2">NEW_FREQUENCY</h3>
              
              <AdminListForm filename="rss.json" sha={sha} currentList={feeds} idField="id">
                <div className="group mb-4">
                  <label className="block text-[10px] text-endfield-accent mb-1">SOURCE_NAME</label>
                  <input name="name" required className="w-full bg-black border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none text-white"/>
                </div>
                <div className="group mb-4">
                  <label className="block text-[10px] text-gray-500 mb-1">RSS_URL (XML/Atom)</label>
                  <input name="url" required className="w-full bg-black border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none text-white font-mono" placeholder="https://.../feed.xml"/>
                </div>
                <div className="group mb-4">
                  <label className="block text-[10px] text-gray-500 mb-1">AVATAR_URL (Optional)</label>
                  <input name="avatar" className="w-full bg-black border border-white/20 p-2 text-xs focus:border-endfield-accent outline-none text-gray-300" placeholder="https://..."/>
                </div>
              </AdminListForm>
            </div>
          </div>

          {/* 右侧列表 */}
          <div className="lg:col-span-7">
             <div className="space-y-3">
               {feeds.map((feed: any) => (
                 <div key={feed.id} className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 hover:border-endfield-accent transition-colors group">
                    
                    {/* 2. 使用客户端组件替换原生 img */}
                    <RssAvatar src={feed.avatar} alt="avatar" />

                    <div className="flex-1 min-w-0">
                       <div className="text-sm font-bold text-white mb-1 truncate">{feed.name}</div>
                       <div className="text-[10px] text-gray-500 font-mono truncate">{feed.url}</div>
                    </div>
                    
                    <AdminListActions 
                      filename="rss.json"
                      sha={sha}
                      itemId={feed.id}
                      itemName={feed.name}
                      fullList={feeds}
                    />
                 </div>
               ))}

               {feeds.length === 0 && (
                 <div className="text-center py-8 text-gray-600 border border-dashed border-white/10 text-xs">
                   NO_SIGNAL_FOUND
                 </div>
               )}
             </div>
          </div>

        </div>
      </div>
    </main>
  );
}