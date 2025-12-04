import { getSortedPostsData } from "@/lib/posts";
import Navbar from "@/components/Navbar";
import MatrixBackground from "@/components/MatrixBackground";
import ArchiveTerminal from "@/components/ArchiveTerminal";

export default function ArchivesPage() {
  const allPosts = getSortedPostsData();

  // 数据处理：按年份分组
  const archives: { [year: string]: typeof allPosts } = {};

  allPosts.forEach(post => {
    // === 修复点：增加日期空值检查 ===
    // 如果文章没有 date 字段，使用 "1970-01-01" 或当前日期作为兜底，防止 split 报错
    const dateStr = post.date || "1970-01-01";
    
    // 安全分割年份
    const year = dateStr.includes("-") ? dateStr.split("-")[0] : "UNKNOWN";

    if (!archives[year]) {
      archives[year] = [];
    }
    archives[year].push(post);
  });

  return (
    <main className="min-h-screen relative text-white selection:bg-endfield-accent selection:text-black">
      <MatrixBackground />
      <div className="fixed inset-0 bg-gradient-to-t from-endfield-base via-transparent to-transparent pointer-events-none z-0" />
      
      {/* RootLayout 已包含 Navbar */}

      <div className="max-w-5xl mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="mb-10">
           <h1 className="text-4xl font-bold uppercase mb-2">
             Database_<span className="text-endfield-accent">Archives</span>
           </h1>
           <p className="text-xs text-gray-500 font-mono">
             ACCESS LEVEL: PUBLIC // SELECT DIRECTORY TO VIEW LOGS
           </p>
        </div>

        {/* 调用终端组件 */}
        <ArchiveTerminal archives={archives} />
      </div>
    </main>
  );
}