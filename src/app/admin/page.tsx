import Link from "next/link";
import { fetchGithubFiles, deleteGithubFile } from "@/lib/github";
import { revalidatePath } from "next/cache";
import Navbar from "@/components/Navbar";
import MatrixBackground from "@/components/MatrixBackground";

async function deleteAction(formData: FormData) {
  "use server";
  const slug = formData.get("slug") as string;
  const sha = formData.get("sha") as string;
  if (slug && sha) {
    await deleteGithubFile(slug, sha);
    revalidatePath("/admin");
    revalidatePath("/");
  }
}

export default async function AdminDashboard() {
  const files = await fetchGithubFiles();

  return (
    <main className="min-h-screen bg-[#050505] text-white font-mono selection:bg-endfield-accent selection:text-black overflow-x-hidden">
      <MatrixBackground />
      <Navbar />

      <div className="fixed top-16 left-0 w-full h-12 border-b border-white/10 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-between px-6">
        <div className="flex gap-4 text-[10px] text-endfield-dim">
           <span>SYS.VER.4.1</span>
           <span>CONN: <span className="text-green-500">SECURE</span></span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-36 pb-20 relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* === 左侧：功能菜单 === */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* 快捷菜单 */}
          <div className="space-y-2">
            <h3 className="text-xs text-endfield-accent mb-2 font-bold">// QUICK_ACCESS</h3>
            
            <Link href="/admin/about" className="block border border-white/10 bg-white/5 p-3 hover:border-endfield-accent hover:bg-endfield-accent hover:text-black transition-colors">
               <div className="text-sm font-bold">Manage: ABOUT</div>
               <div className="text-[10px] opacity-60">Edit Profile & Stack</div>
            </Link>

            <Link href="/admin/friends" className="block border border-white/10 bg-white/5 p-3 hover:border-endfield-accent hover:bg-endfield-accent hover:text-black transition-colors">
               <div className="text-sm font-bold">Manage: FRIENDS</div>
               <div className="text-[10px] opacity-60">Link Connections</div>
            </Link>
          </div>

          <div className="border border-white/20 bg-black/60 p-5 relative">
            <h3 className="text-xs text-gray-400 mb-2">TOTAL_POSTS</h3>
            <div className="text-4xl font-bold text-endfield-accent">{files.length}</div>
          </div>

          <Link href="/admin/editor/new" className="block group relative">
             <div className="absolute inset-0 bg-endfield-accent translate-x-1 translate-y-1 transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />
             <div className="relative bg-black border border-endfield-accent p-4 text-center cursor-pointer hover:bg-endfield-accent hover:text-black transition-colors">
                <span className="font-bold tracking-widest">+ NEW_POST</span>
             </div>
          </Link>
        </div>

        {/* === 右侧：文件矩阵 (保持不变) === */}
        <div className="lg:col-span-3">
           {/* ...这里是之前的文章列表代码，为了节省篇幅，请保留原来的... */}
           <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-endfield-accent" />
              FILE_SYSTEM
            </h2>
          </div>
          <div className="grid grid-cols-12 text-[10px] text-gray-500 px-4 pb-2 border-b border-white/10 uppercase tracking-wider">
             <div className="col-span-6">Filename</div>
             <div className="col-span-6 text-right">Action</div>
          </div>
          <div className="space-y-1 mt-2">
            {files.map((file) => (
              <div key={file.sha} className="grid grid-cols-12 items-center p-4 bg-white/5 hover:bg-white/10 transition-all">
                <div className="col-span-6 font-bold truncate">{file.name}</div>
                <div className="col-span-6 flex justify-end gap-3">
                  <Link href={`/admin/editor/${file.slug}`} className="text-xs hover:text-endfield-accent underline">EDIT</Link>
                  <form action={deleteAction}>
                    <input type="hidden" name="slug" value={file.slug} />
                    <input type="hidden" name="sha" value={file.sha} />
                    <button className="text-xs text-gray-500 hover:text-red-500">[DEL]</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}