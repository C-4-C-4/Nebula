import { getSortedPostsData } from "@/lib/posts";
import MatrixBackground from "@/components/MatrixBackground";
import Navbar from "@/components/Navbar";
import SideHUD from "@/components/SideHUD";
import HomeHero from "@/components/HomeHero"; // 引入客户端组件 (负责3D动画)
import PostList from "@/components/PostList"; // 引入客户端组件 (负责列表交互)

// 这是一个服务端组件 (Server Component)，没有 "use client"
export default function Home() {
  // 1. 在服务端直接读取 posts 文件夹下的数据 (fs 操作)
  // 这样就不会报 "fs module not found" 的错了
  const posts = getSortedPostsData();

  return (
    <main className="min-h-screen relative text-white selection:bg-endfield-accent selection:text-black">
      {/* 2. 背景组件 */}
      <MatrixBackground />
      <div className="fixed inset-0 bg-gradient-to-t from-endfield-base via-transparent to-transparent pointer-events-none z-0" />
      
      {/* 3. 导航与侧边栏 */}
      <Navbar />
      <SideHUD />

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 relative z-10">
        
        {/* 4. 头部 Hero 区域 */}
        {/* 我们把 3D 核心和打字机动画封装到了这个客户端组件里 */}
        <HomeHero />

        {/* 5. 数据统计栏 */}
        <div className="mb-8 flex items-end justify-between border-b border-white/10 pb-4">
           <h2 className="text-2xl font-bold font-mono flex items-center gap-2">
             <span className="w-2 h-2 bg-endfield-accent" />
             DATA_LOGS
           </h2>
           <span className="text-xs font-mono text-gray-500">TOTAL: {posts.length} RECORDS</span>
        </div>

        {/* 6. 文章列表 */}
        {/* 我们把数据传给这个客户端组件进行渲染 */}
        <PostList posts={posts} />

      </div>
    </main>
  );
}