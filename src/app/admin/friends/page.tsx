import Link from "next/link";
import { fetchJsonData, saveJsonData } from "@/lib/github";
import { revalidatePath } from "next/cache";
import Navbar from "@/components/Navbar";

async function deleteFriendAction(formData: FormData) {
  "use server";
  const idToDelete = formData.get("id") as string;
  const sha = formData.get("sha") as string;
  
  // 1. 获取当前数据 (重新获取一次以确保并发安全)
  const file = await fetchJsonData("friends.json");
  if (!file) return;

  // 2. 过滤掉要删除的项
  const newFriends = (file.data as any[]).filter(f => f.id !== idToDelete);

  // 3. 保存回去 (注意：这里要用最新的 sha，即 file.sha)
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
        
        <div className="flex justify-between items-end mb-8 border-b border-white/20 pb-4">
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
                   {/* 这里的 SHA 实际上需要每次操作都获取最新的，为了简单我们这里假设列表加载时的 sha 是准的。
                       在 deleteFriendAction 里我们重新 fetch 了一次，所以这里的 sha 参数其实主要是为了传给 Server Action 触发器，
                       实际上逻辑里用了 fetch 后的新 sha。但为了 Server Action 签名匹配，我们还是传一下 */}
                   <input type="hidden" name="sha" value={file?.sha} />
                   <button className="text-xs text-gray-500 hover:text-red-500">[DEL]</button>
                 </form>
               </div>
             </div>
           ))}
        </div>
      </div>
    </main>
  );
}