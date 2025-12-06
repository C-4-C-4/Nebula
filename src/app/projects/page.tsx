import Navbar from "@/components/Navbar";
import MatrixBackground from "@/components/MatrixBackground";
import ProjectCard from "@/components/ProjectCard";
import { fetchGithubRepos } from "@/lib/github";

export const revalidate = 3600; // 1小时更新一次缓存

export default async function ProjectsPage() {
  const repos = await fetchGithubRepos();

  return (
    <main className="min-h-screen relative text-white selection:bg-endfield-accent selection:text-black">
      <MatrixBackground />
      <div className="fixed inset-0 bg-gradient-to-t from-endfield-base via-transparent to-transparent pointer-events-none z-0" />
      
      {/* 确保 RootLayout 中没有重复引入 Navbar，或者在这里不引入，取决于你的 Layout 设置 */}
      {/* 按照之前的逻辑，RootLayout 已经有了 Navbar，所以这里不需要写 <Navbar /> */}
      {/* 如果你发现没有导航栏，请取消下面这行的注释 */}
      {/* <Navbar /> */}

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
        
        {/* 页面头部 */}
        <div className="mb-12 border-l-4 border-endfield-accent pl-6 py-2 flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div>
             <h1 className="text-4xl md:text-6xl font-bold uppercase mb-2">
               Project_<span className="text-endfield-accent">List</span>
             </h1>
             <p className="text-xs font-mono text-endfield-dim">
               /HOME/USER/REPOSITORIES // FETCHING_DATA_STREAM...
             </p>
           </div>
           
           <div className="text-right hidden md:block">
             <div className="text-3xl font-bold text-white">{repos.length}</div>
             <div className="text-[10px] text-gray-500 font-mono">TOTAL_MODULES</div>
           </div>
        </div>

        {/* 项目网格 */}
        {repos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {repos.map((repo, idx) => (
               <ProjectCard key={repo.id} data={repo} index={idx} />
             ))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/10 bg-white/5">
            <div className="text-endfield-accent text-xl font-bold mb-2">NO_SIGNAL</div>
            <p className="text-xs text-gray-500 font-mono">Unable to retrieve repository data.</p>
          </div>
        )}

        {/* 底部装饰 */}
        <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-gray-600">
           <span>SYNC_SOURCE: GITHUB_API_V3</span>
           <span>END_OF_LIST</span>
        </div>

      </div>
    </main>
  );
}