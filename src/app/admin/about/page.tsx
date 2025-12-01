import { fetchJsonData, saveJsonData } from "@/lib/github";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"; // 确保引入了 redirect
import Navbar from "@/components/Navbar";

async function saveAboutAction(formData: FormData) {
  "use server";
  const sha = formData.get("sha") as string;
  
  const newData = {
    siteName: formData.get("siteName"),
    logo: formData.get("logo"),
    blogger: formData.get("blogger"),
    avatar: formData.get("avatar"),
    role: formData.get("role"),
    description: formData.get("description"),
    email: formData.get("email"),
    stack: (formData.get("stack") as string).split(",").map(s => s.trim()).filter(s => s)
  };

  await saveJsonData("about.json", newData, sha);
  revalidatePath("/about");
  revalidatePath("/admin/about");
  
  // === 修复点：添加跳转 ===
  redirect("/admin");
}

export default async function AdminAboutPage() {
  const file = await fetchJsonData("about.json");
  if (!file) return <div>Error loading data</div>;

  const { data, sha } = file;

  return (
    <main className="min-h-screen bg-[#09090b] text-white font-mono selection:bg-endfield-accent selection:text-black">
      <Navbar logoText="ENDFIELD.SYS" /> 
      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <h1 className="text-2xl text-endfield-accent mb-8 border-b border-white/10 pb-2">
          EDIT: ABOUT_PROFILE
        </h1>

        <form action={saveAboutAction} className="space-y-6">
          <input type="hidden" name="sha" value={sha} />

          <div className="grid grid-cols-2 gap-6">
             <div className="group">
               <label className="block text-[10px] text-gray-500 mb-1">SITE_NAME</label>
               <input name="siteName" defaultValue={data.siteName} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none"/>
             </div>
             <div className="group">
               <label className="block text-[10px] text-gray-500 mb-1">BLOGGER_NAME</label>
               <input name="blogger" defaultValue={data.blogger} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none"/>
             </div>
          </div>

          <div className="group">
             <label className="block text-[10px] text-gray-500 mb-1">ROLE_TITLE</label>
             <input name="role" defaultValue={data.role} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none"/>
          </div>

          <div className="group">
             <label className="block text-[10px] text-gray-500 mb-1">DESCRIPTION (Supports multi-line)</label>
             <textarea name="description" rows={6} defaultValue={data.description} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none"/>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="group">
               <label className="block text-[10px] text-gray-500 mb-1">LOGO_URL</label>
               <input name="logo" defaultValue={data.logo} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none"/>
             </div>
             <div className="group">
               <label className="block text-[10px] text-gray-500 mb-1">AVATAR_URL</label>
               <input name="avatar" defaultValue={data.avatar} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none"/>
             </div>
          </div>

          <div className="group">
             <label className="block text-[10px] text-gray-500 mb-1">EMAIL</label>
             <input name="email" defaultValue={data.email} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none"/>
          </div>

          <div className="group">
             <label className="block text-[10px] text-gray-500 mb-1">TECH_STACK (Comma separated)</label>
             <input name="stack" defaultValue={data.stack.join(", ")} className="w-full bg-white/5 border border-white/20 p-2 text-sm focus:border-endfield-accent outline-none"/>
             <p className="text-[10px] text-gray-600 mt-1">Example: React, Next.js, TypeScript</p>
          </div>

          <button type="submit" className="w-full bg-endfield-accent text-black font-bold py-3 hover:bg-white transition-colors uppercase tracking-widest mt-8">
            SAVE_PROFILE_DATA
          </button>
        </form>
      </div>
    </main>
  );
}