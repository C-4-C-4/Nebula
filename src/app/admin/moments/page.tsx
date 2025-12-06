import { fetchJsonData, saveJsonData } from "@/lib/github";
import { revalidatePath } from "next/cache";
import Navbar from "@/components/Navbar";
import Link from "next/link";

// 兼容 Cloudflare Pages
export const runtime = 'edge';

// Action: 新增
async function addRssAction(formData: FormData) {
  "use server";
  const sha = formData.get("sha") as string;
  const file = await fetchJsonData("rss.json");
  const currentFeeds = file?.data || [];

  const newFeed = {
    id: `RSS_${Math.floor(Date.now() / 1000)}`,
    name: formData.get("name"),
    url: formData.get("url"),
    avatar: formData.get("avatar") || "https://placehold.co/100x100/000/FFF?text=RSS"
  };

  await saveJsonData("rss.json", [...currentFeeds, newFeed], file?.sha || sha);
  revalidatePath("/moments");
  revalidatePath("/admin/moments");
}

// Action: 删除
async function deleteRssAction(formData: FormData) {
  "use server";
  const id = formData.get("id");
  const file = await fetchJsonData("rss.json");
  if (!file) return;

  const newFeeds = file.data.filter((f: any) => f.id !== id);
  await saveJsonData("rss.json", newFeeds, file.sha);
  revalidatePath("/moments");
  revalidatePath("/admin/moments");
}

export default async function AdminMomentsPage() {
  const file = await fetchJsonData("rss.json");
  const feeds = file?.data || [];
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
          MANAGE: RSS_SUBSCRIPTIONS
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* 左侧：添加表单 */}
          <div className="lg:col-span-5">
            <div className="bg-white/5 border border-white/10 p-6 sticky top-24">
              <h3 className="text-sm font-bold text-gray-400 mb-4 border-l-2 border-endfield-accent pl-2">NEW_FREQUENCY</h3>
              
              <form action={addRssAction} className="space-y-4">
                <input type="hidden" name="sha" value={sha} />
                
                <div className="group">
                  <label className="block text-[10px] text-endfield-accent mb-1">SOURCE_NAME</label>
                  <input name="name" required className="w-full bg-black border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none text-white"/>
                </div>

                <div className="group">
                  <label className="block text-[10px] text-gray-500 mb-1">RSS_URL (XML/Atom)</label>
                  <input name="url" required className="w-full bg-black border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none text-white font-mono" placeholder="https://.../feed.xml"/>
                </div>

                <div className="group">
                  <label className="block text-[10px] text-gray-500 mb-1">AVATAR_URL (Optional)</label>
                  <input name="avatar" className="w-full bg-black border border-white/20 p-2 text-xs focus:border-endfield-accent outline-none text-gray-300"/>
                </div>

                <button className="w-full bg-endfield-accent text-black font-bold py-3 hover:bg-white transition-colors uppercase tracking-widest text-xs mt-4">
                  + ADD_SUBSCRIPTION
                </button>
              </form>
            </div>
          </div>

          {/* 右侧：列表 */}
          <div className="lg:col-span-7">
             <div className="space-y-3">
               {feeds.map((feed: any) => (
                 <div key={feed.id} className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 hover:border-endfield-accent transition-colors group">
                    <img src={feed.avatar} className="w-10 h-10 object-cover bg-black border border-white/10" alt="avatar"/>
                    <div className="flex-1 min-w-0">
                       <div className="text-sm font-bold text-white mb-1 truncate">{feed.name}</div>
                       <div className="text-[10px] text-gray-500 font-mono truncate">{feed.url}</div>
                    </div>
                    
                    <form action={deleteRssAction}>
                       <input type="hidden" name="id" value={feed.id} />
                       <button className="text-[10px] text-red-500 border border-red-500/30 px-2 py-1 hover:bg-red-600 hover:text-white transition-colors">
                         Unsub
                       </button>
                    </form>
                 </div>
               ))}
             </div>
          </div>

        </div>
      </div>
    </main>
  );
}