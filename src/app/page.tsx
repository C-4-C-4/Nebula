import { getSortedPostsData } from "@/lib/posts";
import MatrixBackground from "@/components/MatrixBackground";
import SideHUD from "@/components/SideHUD";
import HomeHero from "@/components/HomeHero";
import PostList from "@/components/PostList";
import { fetchJsonData } from "@/lib/github"; 
import ScrollGuide from "@/components/ScrollGuide"; 

export const revalidate = 3600;

export default async function Home() {
  const posts = getSortedPostsData();
  const file = await fetchJsonData("config.json");
  const config = file?.data || {};

  return (
    <main className="min-h-screen relative text-white selection:bg-endfield-accent selection:text-black">
      <MatrixBackground />
      <div className="fixed inset-0 bg-gradient-to-t from-endfield-base via-transparent to-transparent pointer-events-none z-0" />
      <SideHUD />

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 relative z-10">
        
        {/* 顶部 Hero 区域 */}
        <HomeHero 
          line1={config.heroTitleLine1 || "SYSTEM"} 
          line2={config.heroTitleLine2 || "OVERRIDE"} 
        />

        {/* === 修改点：增加负边距容器，把箭头向上提 === */}
        {/* -mt-32 (约-128px) 抵消了 Hero 的下边距和 Guide 自己的上内边距 */}
        <div className="-mt-32 relative z-20">
           <ScrollGuide />
        </div>
        {/* ======================================= */}

        {/* 文章列表标题 */}
        <div className="mb-8 flex items-end justify-between border-b border-white/10 pb-4">
           <h2 className="text-2xl font-bold font-mono flex items-center gap-2">
             <span className="w-2 h-2 bg-endfield-accent" />
             DATA_LOGS
           </h2>
           <span className="text-xs font-mono text-gray-500">TOTAL: {posts.length} RECORDS</span>
        </div>

        {/* 文章列表 */}
        <PostList posts={posts} />

      </div>
    </main>
  );
}