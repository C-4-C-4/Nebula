import { getSortedPostsData } from "@/lib/posts";
import MatrixBackground from "@/components/MatrixBackground";
import SideHUD from "@/components/SideHUD";
import HomeHero from "@/components/HomeHero";
import PostList from "@/components/PostList";
import { fetchJsonData } from "@/lib/github"; // 引入读取方法

export default async function Home() {
  const posts = getSortedPostsData();
  
  // 1. 读取配置
  const file = await fetchJsonData("config.json");
  const config = file?.data || {};

  return (
    <main className="min-h-screen relative text-white selection:bg-endfield-accent selection:text-black">
      <MatrixBackground />
      <div className="fixed inset-0 bg-gradient-to-t from-endfield-base via-transparent to-transparent pointer-events-none z-0" />
      
      {/* Navbar 已经在 Layout 里了，这里不需要写 */}
      <SideHUD />

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 relative z-10">
        
        {/* 2. 传入配置的文字 */}
        <HomeHero 
          line1={config.heroTitleLine1 || "SYSTEM"} 
          line2={config.heroTitleLine2 || "OVERRIDE"} 
        />

        <div className="mb-8 flex items-end justify-between border-b border-white/10 pb-4">
           <h2 className="text-2xl font-bold font-mono flex items-center gap-2">
             <span className="w-2 h-2 bg-endfield-accent" />
             DATA_LOGS
           </h2>
           <span className="text-xs font-mono text-gray-500">TOTAL: {posts.length} RECORDS</span>
        </div>

        <PostList posts={posts} />

      </div>
    </main>
  );
}