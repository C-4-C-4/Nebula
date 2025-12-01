import Link from "next/link";
import { fetchGithubFiles, deleteGithubFile } from "@/lib/github";
import { deleteSession, verifySession } from "@/lib/auth"; // 1. 引入 verifySession
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import MatrixBackground from "@/components/MatrixBackground";
import AdminLogout from "@/components/AdminLogout";

export const runtime = 'edge';

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

async function logoutAction() {
  "use server";
  await deleteSession();
}

export default async function AdminDashboard() {
  // === 2. 页面级“门神”检查 (关键修复) ===
  // 每次进入页面渲染前，必须先验证 session
  // 如果验证失败，直接在服务端层面重定向，绝不渲染后面的组件
  const isAuth = await verifySession();
  if (!isAuth) {
    redirect("/login");
  }
  // ======================================

  const files = await fetchGithubFiles();

  return (
    <main className="min-h-screen bg-[#050505] text-white font-mono selection:bg-endfield-accent selection:text-black overflow-x-hidden">
      <MatrixBackground />
      {/* ... 其余代码保持不变 ... */}
      <Navbar />

      <div className="fixed top-16 left-0 w-full h-12 border-b border-white/10 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-between px-6">
        <div className="flex gap-4 text-[10px] text-endfield-dim">
           <span>SYS.VER.4.2</span>
           <span>CONN: <span className="text-green-500">SECURE</span></span>
           <span>USER: <span className="text-endfield-accent">ADMIN</span></span>
        </div>
        <div className="w-32 h-2 bg-white/5 overflow-hidden">
           <div className="h-full bg-endfield-accent w-[60%] animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-36 pb-20 relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* 左侧菜单 */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="space-y-2">
            <h3 className="text-xs text-endfield-accent mb-2 font-bold">// QUICK_ACCESS</h3>
            
            <Link href="/admin/about" className="block border border-white/10 bg-white/5 p-3 hover:border-endfield-accent hover:bg-endfield-accent hover:text-black transition-colors group">
               <div className="flex justify-between items-center">
                 <div className="text-sm font-bold">Manage: ABOUT</div>
                 <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">&gt;</span>
               </div>
               <div className="text-[10px] opacity-60">Edit Profile & Stack</div>
            </Link>

            <Link href="/admin/friends" className="block border border-white/10 bg-white/5 p-3 hover:border-endfield-accent hover:bg-endfield-accent hover:text-black transition-colors group">
               <div className="flex justify-between items-center">
                 <div className="text-sm font-bold">Manage: FRIENDS</div>
                 <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">&gt;</span>
               </div>
               <div className="text-[10px] opacity-60">Link Connections Database</div>
            </Link>

            <Link href="/admin/config" className="block border border-white/10 bg-white/5 p-3 hover:border-endfield-accent hover:bg-endfield-accent hover:text-black transition-colors group">
               <div className="flex justify-between items-center">
                 <div className="text-sm font-bold">Manage: CONFIG</div>
                 <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">&gt;</span>
               </div>
               <div className="text-[10px] opacity-60">Copyright & ICP Settings</div>
            </Link>
          </div>

          <div className="border border-white/20 bg-black/60 p-5 relative">
            <h3 className="text-xs text-gray-400 mb-2">TOTAL_POSTS</h3>
            <div className="text-4xl font-bold text-endfield-accent">{files.length}</div>
            <div className="w-full h-1 bg-gray-800 mt-4">
              <div className="h-full bg-endfield-accent" style={{ width: `${Math.min(files.length * 10, 100)}%` }} />
            </div>
          </div>

          <Link href="/admin/editor/new" className="block group relative">
             <div className="absolute inset-0 bg-endfield-accent translate-x-1 translate-y-1 transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />
             <div className="relative bg-black border border-endfield-accent p-4 text-center cursor-pointer hover:bg-endfield-accent hover:text-black transition-colors">
                <span className="font-bold tracking-widest">+ NEW_POST</span>
             </div>
          </Link>

          <AdminLogout onLogout={logoutAction} />
        </div>

        {/* 右侧列表 */}
        <div className="lg:col-span-3">
           <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-endfield-accent" />
              FILE_SYSTEM (POSTS)
            </h2>
            <div className="text-xs text-gray-500">PATH: /posts/*.md</div>
          </div>
          <div className="grid grid-cols-12 text-[10px] text-gray-500 px-4 pb-2 border-b border-white/10 uppercase tracking-wider">
             <div className="col-span-1">Type</div>
             <div className="col-span-6">Filename (Slug)</div>
             <div className="col-span-3">SHA-1 Hash</div>
             <div className="col-span-2 text-right">Action</div>
          </div>
          <div className="space-y-1 mt-2">
            {files.map((file, idx) => (
              <div key={file.sha} className="grid grid-cols-12 items-center p-4 bg-white/5 border-l-2 border-transparent hover:border-endfield-accent hover:bg-white/10 transition-all group">
                <div className="col-span-1"><span className="text-[10px] border border-endfield-dim text-endfield-dim px-1">MD</span></div>
                <div className="col-span-6 font-bold truncate pr-4">{file.name}</div>
                <div className="col-span-3 text-xs text-gray-600 font-mono truncate">{file.sha.substring(0, 8)}...</div>
                <div className="col-span-2 flex justify-end gap-3 items-center">
                  <Link href={`/admin/editor/${file.slug}`} className="text-xs hover:text-endfield-accent underline">EDIT</Link>
                  <form action={deleteAction}>
                    <input type="hidden" name="slug" value={file.slug} />
                    <input type="hidden" name="sha" value={file.sha} />
                    <button className="text-xs text-gray-500 hover:text-red-500 transition-colors">[DEL]</button>
                  </form>
                </div>
              </div>
            ))}
            {files.length === 0 && (
              <div className="h-32 flex items-center justify-center border border-dashed border-white/10 text-gray-600">
                NO_DATA_FOUND // INITIATE_CREATE_SEQUENCE
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}