import Link from "next/link";
import { fetchJsonData, saveJsonData } from "@/lib/github";
import { revalidatePath } from "next/cache";
import Navbar from "@/components/Navbar";

// 兼容 Cloudflare Pages
export const runtime = 'edge';

async function deleteFriendAction(formData: FormData) {
  "use server";
  const idToDelete = formData.get("id") as string;
  const sha = formData.get("sha") as string; // 注意：列表页的 SHA 可能滞后，但对于 JSON 整体覆盖来说通常可行，最好是在操作前 fetch 最新
  
  // 为了安全，操作前重新 fetch 一次获取最新 SHA
  const file = await fetchJsonData("friends.json");
  if (!file) return;

  const newFriends = (file.data as any[]).filter(f => f.id !== idToDelete);

  await saveJsonData("friends.json", newFriends, file.sha);
  revalidatePath("/friends");
  revalidatePath("/admin/friends");
}

export default async function AdminFriendsPage() {
  const file = await fetchJsonData("friends.json");
  const friends = (file?.data || []) as any[];

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-mono selection:bg-endfield-accent selection:text-black">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        
        {/* === 返回按钮 === */}
        <div className="mb-6">
          <Link href="/admin" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1 w-fit group">
             <span>&lt;</span> <span className="group-hover:underline">RETURN_TO_DASHBOARD</span>
          </Link>
        </div>

        <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
          <h1 className="text-2xl text-endfield-accent font-bold">MANAGE: FRIENDS_DB</h1>
          <Link href="/admin/friends/new" className="bg-endfield-accent text-black px-4 py-2 text-sm font-bold hover:bg-white transition-colors">
            + ADD_LINK
          </Link>
        </div>

        <div className="space-y-2">
           {/* 表头 */}
           <div className="grid grid-cols-12 text-[10px] text-gray-500 px-4 pb-2 border-b border-white/10 uppercase">
             <div className="col-span-2">ID</div>
             <div className="col-span-3">Site Name</div>
             <div className="col-span-3">Blogger</div>
             <div className="col-span-4 text-right">Action</div>
           </div>

           {friends.map((friend) => (
             <div key={friend.id} className="grid grid-cols-12 items-center p-4 bg-white/5 border-l-2 border-transparent hover:border-endfield-accent hover:bg-white/10 transition-all">
               <div className="col-span-2 text-xs text-endfield-dim">{friend.id}</div>
               <div className="col-span-3 font-bold truncate">{friend.siteName}</div>
               <div className="col-span-3 text-sm text-gray-400">{friend.blogger}</div>
               <div className="col-span-4 flex justify-end gap-3 items-center">
                 <Link href={`/admin/friends/${friend.id}`} className="text-xs hover:text-endfield-accent underline">EDIT</Link>
                 
                 <form action={deleteFriendAction}>
                   <input type="hidden" name="id" value={friend.id} />
                   {/* 这里的 SHA 仅作为占位，实际 Action 会重新获取 */}
                   <input type="hidden" name="sha" value={file?.sha} />
                   <button className="text-xs text-gray-500 hover:text-red-500">[DEL]</button>
                 </form>
               </div>
             </div>
           ))}
           
           {friends.length === 0 && (
             <div className="text-center py-12 text-gray-600 border border-white/10 bg-white/5 border-dashed">
               NO DATA AVAILABLE // CLICK ADD_LINK
             </div>
           )}
        </div>
      </div>
    </main>
  );
}