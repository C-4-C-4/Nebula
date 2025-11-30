import { fetchJsonData, saveJsonData } from "@/lib/github";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

async function saveFriendAction(formData: FormData) {
  "use server";
  const targetId = formData.get("targetId") as string; // URL中的ID，如果是 'new' 表示新增
  
  // 1. 读取当前数据
  const file = await fetchJsonData("friends.json");
  if (!file) return; // Error handling needed

  let friends = (file.data || []) as any[];

  // 2. 构造新对象
  const newFriend = {
    id: formData.get("id") as string,
    siteName: formData.get("siteName"),
    blogger: formData.get("blogger"),
    url: formData.get("url"),
    logo: formData.get("logo"),
    email: formData.get("email"),
    description: formData.get("description"),
    stack: (formData.get("stack") as string).split(",").map(s => s.trim()).filter(s => s)
  };

  if (targetId === "new") {
    // 新增：追加到数组
    friends.push(newFriend);
  } else {
    // 修改：找到索引并替换
    const index = friends.findIndex(f => f.id === targetId);
    if (index !== -1) {
      friends[index] = newFriend;
    }
  }

  // 3. 保存
  await saveJsonData("friends.json", friends, file.sha);
  revalidatePath("/friends");
  revalidatePath("/admin/friends");
  redirect("/admin/friends");
}

export default async function FriendEditorPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const isNew = id === "new";

  const file = await fetchJsonData("friends.json");
  const friends = (file?.data || []) as any[];
  
  // 如果是编辑模式，找到对应的数据；如果是新增，用默认空数据
  let friendData = {
    id: `LINK_${Math.floor(Math.random() * 1000)}`, // 随机生成一个默认ID
    siteName: "",
    blogger: "",
    url: "",
    logo: "",
    email: "",
    description: "",
    stack: [] as string[]
  };

  if (!isNew) {
    const found = friends.find(f => f.id === id);
    if (found) friendData = found;
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-mono selection:bg-endfield-accent selection:text-black">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-2xl text-endfield-accent mb-8 border-b border-white/10 pb-2">
          {isNew ? "NEW_CONNECTION" : `EDIT: ${friendData.id}`}
        </h1>

        <form action={saveFriendAction} className="space-y-6">
          <input type="hidden" name="targetId" value={id} />

          <div className="grid grid-cols-2 gap-6">
             <div className="group">
               <label className="block text-[10px] text-endfield-accent mb-1">UNIQUE_ID</label>
               <input name="id" defaultValue={friendData.id} required className="w-full bg-black border-b border-white/20 p-2 text-sm focus:border-endfield-accent outline-none"/>
             </div>
             <div className="group">
               <label className="block text-[10px] text-gray-500 mb-1">SITE_NAME</label>
               <input name="siteName" defaultValue={friendData.siteName} required className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none"/>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="group">
               <label className="block text-[10px] text-gray-500 mb-1">BLOGGER</label>
               <input name="blogger" defaultValue={friendData.blogger} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none"/>
             </div>
             <div className="group">
               <label className="block text-[10px] text-gray-500 mb-1">URL (Link)</label>
               <input name="url" defaultValue={friendData.url} required className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none"/>
             </div>
          </div>

          <div className="group">
             <label className="block text-[10px] text-gray-500 mb-1">DESCRIPTION</label>
             <input name="description" defaultValue={friendData.description} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none"/>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="group">
               <label className="block text-[10px] text-gray-500 mb-1">LOGO_URL</label>
               <input name="logo" defaultValue={friendData.logo} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none"/>
             </div>
             <div className="group">
               <label className="block text-[10px] text-gray-500 mb-1">EMAIL</label>
               <input name="email" defaultValue={friendData.email} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none"/>
             </div>
          </div>

          <div className="group">
             <label className="block text-[10px] text-gray-500 mb-1">TECH_STACK (Comma separated)</label>
             <input name="stack" defaultValue={friendData.stack?.join(", ")} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none"/>
          </div>

          <div className="flex gap-4 mt-8">
             <button type="submit" className="flex-1 bg-endfield-accent text-black font-bold py-3 hover:bg-white transition-colors uppercase">
               SAVE_DATA
             </button>
             <a href="/admin/friends" className="px-6 py-3 border border-white/20 text-gray-400 hover:text-white text-center">
               CANCEL
             </a>
          </div>
        </form>
      </div>
    </main>
  );
}