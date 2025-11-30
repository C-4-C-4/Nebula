import { getSortedPostsData } from "@/lib/posts";
import Navbar from "@/components/Navbar";
import MatrixBackground from "@/components/MatrixBackground";
import ArchiveTerminal from "@/components/ArchiveTerminal";

export default function ArchivesPage() {
  const allPosts = getSortedPostsData();

  // 数据处理：按年份分组
  const archives: { [year: string]: typeof allPosts } = {};

  allPosts.forEach(post => {
    // 假设 date 格式是 "2024-11-02"
    const year = post.date.split("-")[0]; 
    if (!archives[year]) {
      archives[year] = [];
    }
    archives[year].push(post);
  });

  return (
    <main className="min-h-screen relative text-white selection:bg-endfield-accent selection:text-black">
      <MatrixBackground />
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="mb-10">
           <h1 className="text-4xl font-bold uppercase mb-2">
             Database_<span className="text-endfield-accent">Archives</span>
           </h1>
           <p className="text-xs text-gray-500 font-mono">
             ACCESS LEVEL: PUBLIC // SELECT DIRECTORY TO VIEW LOGS
           </p>
        </div>

        {/* 调用刚才写的终端组件 */}
        <ArchiveTerminal archives={archives} />
      </div>
    </main>
  );
}