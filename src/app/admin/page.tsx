import Link from "next/link";
import { fetchGithubFiles, deleteGithubFile } from "@/lib/github";
import { deleteSession, verifySession } from "@/lib/auth"; 
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"; 
import Navbar from "@/components/Navbar";
import MatrixBackground from "@/components/MatrixBackground";
import AdminLogout from "@/components/AdminLogout";

// Server Action: 删除文章
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

// Server Action: 登出 (传递给客户端组件使用)
async function logoutAction() {
  "use server";
  await deleteSession(); 
}

// 兼容 Cloudflare Pages
export const runtime = 'edge';

export default async function AdminDashboard() {
  // 1. 页面级权限验证 (门神)
  const isAuth = await verifySession();
  if (!isAuth) {
    redirect("/login");
  }

  // 2. 获取文章列表
  const files = await fetchGithubFiles();

  return (
    <main className="min-h-screen bg-[#050505] text-white font-mono selection:bg-endfield-accent selection:text-black overflow-x-hidden">
      <MatrixBackground />
      <Navbar />

      {/* 顶部状态栏 */}
      <div className="fixed top-16 left-0 w-full h-12 border-b border-white/10 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-between px-6">
        <div className="flex gap-4 text-[10px] text-endfield-dim">
           <span>SYS.VER.4.8</span>
           <span>CONN: <span className="text-green-500">SECURE</span></span>
           <span>USER: <span className="text-endfield-accent">ADMIN</span></span>
        </div>
        <div className="w-32 h-2 bg-white/5 overflow-hidden">
           <div className="h-full bg-endfield-accent w-[60%] animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-36 pb-20 relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* === 左侧：功能菜单 === */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          <div className="space-y-3">
            <h3 className="text-xs text-endfield-accent mb-2 font-bold flex items-center gap-2">
              <span className="w-1 h-3 bg-endfield-accent"/> 
              QUICK_ACCESS
            </h3>
            
            {/* === 菜单按钮组 (包含所有管理模块) === */}
            {[
              { href: "/admin/about", label: "Manage: ABOUT", sub: "Edit Profile & Stack" },
              { href: "/admin/friends", label: "Manage: FRIENDS", sub: "Link Connections Database" },
              { href: "/admin/config", label: "Manage: CONFIG", sub: "Copyright & ICP Settings" },
              { href: "/admin/music", label: "Manage: MUSIC", sub: "Playlist & Lyrics Database" },
              { href: "/admin/timeline", label: "Manage: TIMELINE", sub: "System Logs & Milestones" },
              { href: "/admin/moments", label: "Manage: MOMENTS", sub: "RSS Feed Aggregator" } // === 新增 ===
            ].map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className="group relative block border border-white/10 bg-white/5 p-4 overflow-hidden transition-all duration-300 hover:border-endfield-accent"
              >
                 {/* 滑动背景层 */}
                 <div className="absolute inset-0 bg-endfield-accent translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-out z-0" />
                 
                 {/* 内容层 */}
                 <div className="relative z-10 flex justify-between items-center group-hover:text-black transition-colors duration-300">
                   <div>
                     <div className="text-sm font-bold uppercase tracking-wider">{item.label}</div>
                     <div className="text-[10px] opacity-60 font-mono mt-1">{item.sub}</div>
                   </div>
                   <span className="text-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 font-bold">
                     &gt;
                   </span>
                 </div>
              </Link>
            ))}
          </div>

          <div className="border border-white/20 bg-black/60 p-5 relative">
            <div className="absolute top-0 right-0 p-2 opacity-20 text-4xl font-bold select-none">#</div>
            <h3 className="text-xs text-gray-400 mb-2">TOTAL_POSTS</h3>
            <div className="text-4xl font-bold text-endfield-accent">{files.length}</div>
            <div className="w-full h-1 bg-gray-800 mt-4 overflow-hidden">
              <div className="h-full bg-endfield-accent w-full animate-[scan_2s_linear_infinite]" />
            </div>
          </div>

          {/* 新建按钮 */}
          <Link href="/admin/editor/new" className="block group relative overflow-hidden">
             <div className="absolute inset-0 bg-endfield-accent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0" />
             
             <div className="relative z-10 bg-black border border-endfield-accent p-4 text-center cursor-pointer group-hover:text-black transition-colors duration-300 flex items-center justify-center gap-2">
                <span className="text-xl font-bold leading-none mb-0.5">+</span>
                <span className="font-bold tracking-[0.2em] group-hover:tracking-[0.3em] transition-all duration-300">NEW_POST</span>
             </div>
          </Link>

          {/* 登出按钮组件 */}
          <AdminLogout onLogout={logoutAction} />
        </div>

        {/* === 右侧：文件列表 === */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-endfield-accent" />
              FILE_SYSTEM (POSTS)
            </h2>
            <div className="text-xs text-gray-500 font-mono bg-white/5 px-2 py-1">PATH: /posts/*.md</div>
          </div>

          <div className="grid grid-cols-12 text-[10px] text-gray-500 px-4 pb-2 border-b border-white/10 uppercase tracking-wider">
             <div className="col-span-1">Type</div>
             <div className="col-span-6">Filename (Slug)</div>
             <div className="col-span-3">SHA-1 Hash</div>
             <div className="col-span-2 text-right">Action</div>
          </div>

          <div className="space-y-1 mt-2">
            {files.map((file, idx) => (
              <div 
                key={file.sha} 
                className="grid grid-cols-12 items-center p-4 bg-white/5 border-l-2 border-transparent hover:border-endfield-accent hover:bg-white/10 transition-all duration-200 group"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="col-span-1">
                   <span className="text-[9px] border border-endfield-dim text-endfield-dim px-1.5 py-0.5">MD</span>
                </div>
                
                <div className="col-span-6 font-bold text-white group-hover:text-endfield-accent transition-colors truncate pr-4 text-sm">
                  {file.name}
                </div>
                
                <div className="col-span-3 text-xs text-gray-600 font-mono truncate group-hover:text-gray-400">
                  {file.sha.substring(0, 8)}...
                </div>
                
                <div className="col-span-2 flex justify-end gap-2 items-center">
                  <Link 
                    href={`/admin/editor/${file.slug}`}
                    className="text-[10px] border border-white/20 px-2 py-1 hover:bg-white hover:text-black transition-colors uppercase"
                  >
                    EDIT
                  </Link>
                  
                  <form action={deleteAction}>
                    <input type="hidden" name="slug" value={file.slug} />
                    <input type="hidden" name="sha" value={file.sha} />
                    <button className="text-[10px] border border-red-900/50 text-red-700 px-2 py-1 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors uppercase">
                      DEL
                    </button>
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