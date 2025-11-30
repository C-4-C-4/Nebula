import Link from "next/link";
import { fetchGithubFiles, deleteGithubFile } from "@/lib/github";
import { revalidatePath } from "next/cache";
import Navbar from "@/components/Navbar";
import MatrixBackground from "@/components/MatrixBackground";

// 删除文章的 Server Action
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
  // 获取文章列表
  const files = await fetchGithubFiles();

  return (
    <main className="min-h-screen bg-[#050505] text-white font-mono selection:bg-endfield-accent selection:text-black overflow-x-hidden">
      <MatrixBackground />
      <Navbar />

      {/* 顶部状态栏 */}
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
        
        {/* === 左侧：功能菜单与状态 === */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* 快捷功能入口 */}
          <div className="space-y-2">
            <h3 className="text-xs text-endfield-accent mb-2 font-bold">// QUICK_ACCESS</h3>
            
            {/* 1. 关于页面管理 */}
            <Link href="/admin/about" className="block border border-white/10 bg-white/5 p-3 hover:border-endfield-accent hover:bg-endfield-accent hover:text-black transition-colors group">
               <div className="flex justify-between items-center">
                 <div className="text-sm font-bold">Manage: ABOUT</div>
                 <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">&gt;</span>
               </div>
               <div className="text-[10px] opacity-60">Edit Profile & Stack</div>
            </Link>

            {/* 2. 友情链接管理 */}
            <Link href="/admin/friends" className="block border border-white/10 bg-white/5 p-3 hover:border-endfield-accent hover:bg-endfield-accent hover:text-black transition-colors group">
               <div className="flex justify-between items-center">
                 <div className="text-sm font-bold">Manage: FRIENDS</div>
                 <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">&gt;</span>
               </div>
               <div className="text-[10px] opacity-60">Link Connections Database</div>
            </Link>

            {/* 3. 站点配置管理 (新增) */}
            <Link href="/admin/config" className="block border border-white/10 bg-white/5 p-3 hover:border-endfield-accent hover:bg-endfield-accent hover:text-black transition-colors group">
               <div className="flex justify-between items-center">
                 <div className="text-sm font-bold">Manage: CONFIG</div>
                 <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">&gt;</span>
               </div>
               <div className="text-[10px] opacity-60">Copyright & ICP Settings</div>
            </Link>
          </div>

          {/* 文章统计卡片 */}
          <div className="border border-white/20 bg-black/60 p-5 relative">
            <h3 className="text-xs text-gray-400 mb-2">TOTAL_POSTS</h3>
            <div className="text-4xl font-bold text-endfield-accent">{files.length}</div>
            <div className="w-full h-1 bg-gray-800 mt-4">
              <div className="h-full bg-endfield-accent" style={{ width: `${Math.min(files.length * 10, 100)}%` }} />
            </div>
          </div>

          {/* 新增文章按钮 */}
          <Link href="/admin/editor/new" className="block group relative">
             <div className="absolute inset-0 bg-endfield-accent translate-x-1 translate-y-1 transition-transform group-hover:translate-x-2 group-hover:translate-y-2" />
             <div className="relative bg-black border border-endfield-accent p-4 text-center cursor-pointer hover:bg-endfield-accent hover:text-black transition-colors">
                <span className="font-bold tracking-widest">+ NEW_POST</span>
             </div>
          </Link>

          <div className="text-[10px] text-gray-600 leading-relaxed p-2">
            SYSTEM_LOG: Github API connected. Any changes made here will be directly committed to the main branch.
          </div>
        </div>

        {/* === 右侧：文章文件矩阵 === */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-endfield-accent" />
              FILE_SYSTEM (POSTS)
            </h2>
            <div className="text-xs text-gray-500">PATH: /posts/*.md</div>
          </div>

          {/* 列表头部 */}
          <div className="grid grid-cols-12 text-[10px] text-gray-500 px-4 pb-2 border-b border-white/10 uppercase tracking-wider">
             <div className="col-span-1">Type</div>
             <div className="col-span-6">Filename (Slug)</div>
             <div className="col-span-3">SHA-1 Hash</div>
             <div className="col-span-2 text-right">Action</div>
          </div>

          {/* 列表内容 */}
          <div className="space-y-1 mt-2">
            {files.map((file, idx) => (
              <div 
                key={file.sha} 
                className="grid grid-cols-12 items-center p-4 bg-white/5 border-l-2 border-transparent hover:border-endfield-accent hover:bg-white/10 transition-all group"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="col-span-1">
                   <span className="text-[10px] border border-endfield-dim text-endfield-dim px-1">MD</span>
                </div>
                
                <div className="col-span-6 font-bold text-white group-hover:text-endfield-accent transition-colors truncate pr-4">
                  {file.name}
                </div>
                
                <div className="col-span-3 text-xs text-gray-600 font-mono truncate">
                  {file.sha.substring(0, 8)}...
                </div>
                
                <div className="col-span-2 flex justify-end gap-3 items-center">
                  <Link 
                    href={`/admin/editor/${file.slug}`}
                    className="text-xs text-white hover:text-endfield-accent underline decoration-1 underline-offset-4"
                  >
                    EDIT
                  </Link>
                  
                  <form action={deleteAction}>
                    <input type="hidden" name="slug" value={file.slug} />
                    <input type="hidden" name="sha" value={file.sha} />
                    <button className="text-xs text-gray-500 hover:text-red-500 transition-colors">
                      [DEL]
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